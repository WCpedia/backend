import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SearchRepository } from '../repository/search.repository';
import axios, { AxiosResponse } from 'axios';
import { ProductConfigService } from '@core/config/services/config.service';
import { OAUTH_KEY, REDIS_KEY } from '@core/config/constants/config.constant';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { extractRegion } from '@src/utils/region-extractor';
import { PlaceCategory, Prisma, Region } from '@prisma/client';
import { IPlaceCategory } from '@src/interface/common.interface';
import {
  IKakaoSearchDocuments,
  IKakaoSearchResponse,
} from '../interface/interface';
import { BasicPlaceDto } from '../../common/dto/basic-place.dto';
import { plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SearchService {
  private kakaoSearchUri: string;
  private kakaoAuthKey: string;
  private redisCategoryKey: string;
  private redisPlaceCategoryKey: string;
  private redisPlaceCategoryTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly searchRepository: SearchRepository,
    private readonly configService: ProductConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.kakaoSearchUri = this.configService.get<string>(
      OAUTH_KEY.KAKAO_SEARCH_KEYWORD_URI,
    );
    this.kakaoAuthKey = this.configService.get<string>(
      OAUTH_KEY.KAKAO_AUTHORIZATION_KEY,
    );
    this.redisCategoryKey = this.configService.get<string>(
      REDIS_KEY.REDIS_CATEGORY_KEY,
    );
    this.redisPlaceCategoryKey = this.configService.get<string>(
      REDIS_KEY.REDIS_PLACE_CATEGORY_KEY,
    );
    this.redisPlaceCategoryTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_PLACE_CATEGORY_TTL,
    );
  }

  async searchPlaces(value: string): Promise<BasicPlaceDto[]> {
    const kakaoData = await this.fetchKakaoSearchResponse(value);
    const places = await this.createPlacesFromKakaoData(kakaoData);

    return plainToInstance(BasicPlaceDto, places);
  }

  private async fetchKakaoSearchResponse(
    value: string,
  ): Promise<IKakaoSearchDocuments[]> {
    try {
      const response: AxiosResponse<IKakaoSearchResponse> = await axios.get(
        this.kakaoSearchUri,
        {
          headers: {
            Authorization: this.kakaoAuthKey,
            'Content-type': 'application/x-www-form-urlencoded',
          },
          params: {
            query: value,
          },
        },
      );

      return response.data.documents;
    } catch (error) {
      throw new InternalServerErrorException(
        `Kakao API 호출에 실패했습니다: ${error}`,
      );
    }
  }

  private async createPlacesFromKakaoData(kakaoData: IKakaoSearchDocuments[]) {
    const placePromises = kakaoData.map(async (data) => {
      // 먼저 해당 kakaoId를 가진 장소가 있는지 확인
      let place;

      if (!place) {
        // 장소가 없을 경우, 새로 생성
        const [placeCategory, selectedRegion] = await Promise.all([
          this.upsertPlaceCategory(data.category_name),
          this.getPlaceRegion(data.address_name),
        ]);

        place = await this.searchRepository.upsertPlace({
          kakaoId: data.id,
          name: data.place_name,
          placeCategoryId: placeCategory.id,
          regionId: selectedRegion.id,
          detailAddress: selectedRegion.detailAddress,
          telephone: data.phone,
          kakaoUrl: data.place_url,
          x: parseFloat(data.x),
          y: parseFloat(data.y),
        });
      }

      return place;
    });

    return Promise.all(placePromises);
  }

  private async getPlaceRegion(address: string): Promise<
    Region & {
      detailAddress: string;
    }
  > {
    const { detailAddress, ...region } = extractRegion(address);
    const selectedRegion = await this.searchRepository.getRegion(region);

    return { ...selectedRegion, detailAddress };
  }

  private async upsertPlaceCategory(
    categoryName: string,
  ): Promise<{ id: number }> {
    // 카테고리 풀 텍스트로 캐시에서 카테고리 ID를 조회
    const cacheKey = this.generateCacheKey(
      this.redisPlaceCategoryKey,
      categoryName,
    );
    let placeCategoryId = await this.cacheManager.get<number>(cacheKey);
    if (placeCategoryId) {
      return { id: placeCategoryId };
    }

    // 카테고리가 캐시에 없으면, fullCategoryIds와 categoryIds를 생성
    const placeCategory: IPlaceCategory =
      await this.generatePlaceCategory(categoryName);

    // fullCategoryIds를 사용하여 캐시에서 가게 카테고리 ID를 조회
    const fullCategoryCacheKey = this.generateCacheKey(
      this.redisPlaceCategoryKey,
      placeCategory.fullCategoryIds,
    );
    placeCategoryId = await this.cacheManager.get<number>(fullCategoryCacheKey);

    if (!placeCategoryId) {
      //없다면, 새로운 카테고리를 placeCategory에 저장
      const newPlaceCategory =
        await this.searchRepository.upsertPlaceCategory(placeCategory);
      placeCategoryId = newPlaceCategory.id;
    }

    //새로운 카테고리를 풀 텍스트로 케시에 저장
    await this.cacheManager.set(cacheKey, placeCategoryId, {
      ttl: this.redisPlaceCategoryTtl,
    });

    return { id: placeCategoryId };
  }

  private async generatePlaceCategory(
    category: string,
  ): Promise<IPlaceCategory> {
    const categoryParts = category.split(' > ');

    const categoryIds = await Promise.all(
      categoryParts.map(async (name, index) => {
        const cacheKey = this.generateCacheKey(this.redisCategoryKey, name);
        let categoryId = await this.cacheManager.get<number>(cacheKey);
        if (!categoryId) {
          const category = await this.searchRepository.upsertCategory(name);
          categoryId = category.id;
        }
        return categoryId;
      }),
    );

    const categoryIdsLength = categoryIds.length;
    const placeCategory: IPlaceCategory = {
      fullCategoryIds: categoryIds.join('|'),
      lastDepth: categoryIdsLength,
      depth1Id: categoryIds[0],
      depth2Id: categoryIdsLength > 1 ? categoryIds[1] : null,
      depth3Id: categoryIdsLength > 2 ? categoryIds[2] : null,
      depth4Id: categoryIdsLength > 3 ? categoryIds[3] : null,
      depth5Id: categoryIdsLength > 4 ? categoryIds[4] : null,
    };

    return placeCategory;
  }
  private generateCacheKey(baseKey: string, suffix: string): string {
    return `${baseKey}/${suffix}`;
  }
}
