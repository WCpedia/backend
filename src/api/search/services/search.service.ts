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

  async searchPlaces(value: string): Promise<any> {
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
    return this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        const placePromises = kakaoData.map(async (data) => {
          // 먼저 해당 kakaoId를 가진 장소가 있는지 확인
          let place = await this.searchRepository.getPlaceByKakaoId(
            data.id,
            transaction,
          );

          if (!place) {
            // 장소가 없을 경우, 새로 생성
            const [placeCategory, selectedRegion] = await Promise.all([
              this.upsertPlaceCategory(data.category_name, transaction),
              this.getPlaceRegion(data.address_name),
            ]);

            place = await this.searchRepository.upsertPlace(
              {
                kakaoId: data.id,
                name: data.place_name,
                placeCategoryId: placeCategory.id,
                regionId: selectedRegion.id,
                detailAddress: selectedRegion.detailAddress,
                telephone: data.phone,
                kakaoUrl: data.place_url,
                x: parseFloat(data.x),
                y: parseFloat(data.y),
              },
              transaction,
            );
          }

          return place;
        });

        return Promise.all(placePromises);
      },
    );
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
    transaction: Prisma.TransactionClient,
  ): Promise<{ id: number }> {
    // 카테고리 이름을 기반으로 캐시에서 카테고리 ID를 조회
    const cacheKey = `${this.redisPlaceCategoryKey}/${categoryName}`;
    let placeCategoryId = await this.cacheManager.get<number>(cacheKey);

    if (placeCategoryId) {
      return { id: placeCategoryId };
    }

    // 캐시에 없다면, 새로운 카테고리를 생성하거나 업데이트
    const placeCategory: IPlaceCategory = await this.generatePlaceCategory(
      categoryName,
      transaction,
    );

    // fullCategoryIds를 사용하여 캐시에서 카테고리 ID를 다시 조회
    const fullCategoryCacheKey = `${this.redisPlaceCategoryKey}/${placeCategory.fullCategoryIds}`;
    placeCategoryId = await this.cacheManager.get<number>(fullCategoryCacheKey);

    if (!placeCategoryId) {
      // 캐시에 없다면, 새로운 카테고리를 저장소에 저장하고, 캐시에도 저장
      const newPlaceCategory = await this.searchRepository.upsertPlaceCategory(
        placeCategory,
        transaction,
      );
      placeCategoryId = newPlaceCategory.id;
    }

    await this.cacheManager.set(cacheKey, placeCategoryId, {
      ttl: this.redisPlaceCategoryTtl,
    });

    return { id: placeCategoryId };
  }

  private async generatePlaceCategory(
    category: string,
    transaction: Prisma.TransactionClient,
  ): Promise<IPlaceCategory> {
    const categoryParts = category.split(' > ');
    const categoryIds = [];
    const placeCategory: IPlaceCategory = {
      fullCategoryIds: null,
      lastDepth: categoryParts.length,
      depth1Id: null,
    };

    for (const [depth, name] of categoryParts.entries()) {
      const cacheKey = `${this.redisCategoryKey}/${name}`;

      // Redis에서 카테고리 ID 조회
      let categoryId = await this.cacheManager.get<number>(cacheKey);

      if (!categoryId) {
        // Redis에 없으면 데이터베이스에서 카테고리 생성 또는 업데이트
        const category = await this.searchRepository.upsertCategory(
          name,
          transaction,
        );
        categoryId = category.id;
      }
      categoryIds.push(categoryId);
      placeCategory[`depth${depth + 1}Id`] = categoryId;
    }
    placeCategory.fullCategoryIds = categoryIds.join('|');

    return placeCategory;
  }
}
