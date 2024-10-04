import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { UpdateToiletInfoDto } from '../controllers/dtos/request/update-toilet-info.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { AdminExceptionEnum } from '@exceptions/http/enums/admin.exception.enum';
import {
  IKakaoSearchDocuments,
  IKakaoSearchResponse,
} from '@api/search/interface/interface';
import axios, { AxiosResponse } from 'axios';
import { ProductConfigService } from '@core/config/services/config.service';
import { OAUTH_KEY, REDIS_KEY } from '@core/config/constants/config.constant';
import { SEARCH_SIZE } from '../constants/const';
import { BasicPlaceDto } from '@api/common/dto/basic-place.dto';
import { plainToInstance } from 'class-transformer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Prisma, Region } from '@prisma/client';
import { extractRegion } from '@src/utils/region-extractor';
import { IPlaceCategory } from '@src/interface/common.interface';
import { AdminSearchPlacesDto } from '../controllers/dtos/response/admin-search-places.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { ToiletInfoDto } from '@api/toilet/request/toilet-info.dto';
import { CustomBadRequest } from '@exceptions/http/custom-bad-request';
import { CustomNotFound } from '@exceptions/http/custom-not-found';

@Injectable()
export class AdminPlaceService {
  private kakaoAuthKey: string;
  private kakaoSearchUri: string;
  private redisCategoryKey: string;
  private redisPlaceCategoryKey: string;
  private redisPlaceCategoryTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly adminRepository: AdminRepository,
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

  async createPlaceToiletInfo(
    placeId: number,
    adminId: number,
    dto: UpdateToiletInfoDto,
  ): Promise<void> {
    await this.verifyPlaceEligibleForToiletInfo(placeId);

    const averageRating = this.calculateAverageRating(dto);
    const { toilets, ...placeRating } = dto;

    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.adminRepository.createAdminPlaceToiletRating(
          {
            placeId,
            adminId,
            ...placeRating,
            averageRating,
          },
          transaction,
        );
        for (const toilet of toilets) {
          await this.adminRepository.createToiletInfo(
            placeId,
            toilet,
            transaction,
          );
        }
      },
    );
  }

  private async verifyPlaceEligibleForToiletInfo(placeId: number) {
    const selectedPlace =
      await this.adminRepository.getPlaceWithAdminPlaceToiletRatingById(
        placeId,
      );

    if (!selectedPlace) {
      throw new CustomNotFound(AdminExceptionEnum.NOT_FOUND_PLACE);
    }

    if (selectedPlace.adminPlaceToiletRating) {
      throw new CustomBadRequest(AdminExceptionEnum.ALREADY_RATED_PLACE);
    }
  }

  private calculateAverageRating(placeRating: UpdateToiletInfoDto): number {
    return (
      (placeRating.cleanlinessRating +
        placeRating.interiorRating +
        placeRating.odorRating) /
      3
    );
  }

  async() {}

  async searchPlaces(value: string): Promise<AdminSearchPlacesDto[]> {
    const kakaoData = await this.fetchKakaoSearchResponse(value);
    const places = await this.createPlacesFromKakaoData(kakaoData);

    return plainToInstance(AdminSearchPlacesDto, places);
  }

  private async fetchKakaoSearchResponse(
    value: string,
    size: number = SEARCH_SIZE,
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
            size,
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

  private async createPlacesFromKakaoData(
    kakaoData: IKakaoSearchDocuments[],
  ): Promise<BasicPlaceDto[]> {
    // 중복되지 않는 카테고리를 Set을 사용하여 추출
    const uniqueCategories = this.extractUniqueCategories(kakaoData);
    //카테고리 캐시 또는 새로 생성및 PlaceId를 반환하는 Promise를 생성
    const categoryPromiseMap =
      await this.createCategoryPromiseMap(uniqueCategories);

    //가게정보 생성 Promise
    const placePromises = this.createPlacePromises(
      kakaoData,
      categoryPromiseMap,
    );

    return this.resolvePlacePromises(placePromises);
  }

  private extractUniqueCategories(
    kakaoData: IKakaoSearchDocuments[],
  ): string[] {
    const categorySet = new Set<string>();
    kakaoData.forEach((data) => {
      return categorySet.add(data.category_name);
    });

    return Array.from(categorySet);
  }

  private async createCategoryPromiseMap(
    uniqueCategories: string[],
  ): Promise<Map<string, Promise<{ id: number }>>> {
    const categoryMap = new Map<string, Promise<{ id: number }>>();
    uniqueCategories.forEach((categoryName) => {
      categoryMap.set(categoryName, this.upsertPlaceCategory(categoryName));
    });

    return categoryMap;
  }

  private createPlacePromises(
    kakaoData: IKakaoSearchDocuments[],
    categoryPromiseMap: Map<string, Promise<{ id: number }>>,
  ): Promise<BasicPlaceDto>[] {
    return kakaoData.map(async (data) => {
      const placeCategoryPromise = categoryPromiseMap.get(data.category_name);
      const [placeCategory, selectedRegion] = await Promise.all([
        placeCategoryPromise,
        this.getPlaceRegion(data.address_name),
      ]);

      const place: BasicPlaceDto =
        await this.adminRepository.upsertPlaceIncludeToiletInfo({
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

      return place;
    });
  }

  private async getPlaceRegion(address: string): Promise<
    Region & {
      detailAddress: string;
    }
  > {
    const { detailAddress, ...region } = extractRegion(address);
    const selectedRegion = await this.adminRepository.getRegion(region);

    return { ...selectedRegion, detailAddress };
  }

  private async upsertPlaceCategory(
    categoryName: string,
  ): Promise<{ id: number }> {
    // 카테고리 풀 텍스트로 캐시에서 카테고리 ID를 조회
    const fullCategoryPathCacheKey = this.generateCacheKey(
      this.redisPlaceCategoryKey,
      categoryName,
    );
    let placeCategoryId = await this.cacheManager.get<number>(
      fullCategoryPathCacheKey,
    );
    if (placeCategoryId) {
      return { id: placeCategoryId };
    }

    // 카테고리가 캐시에 없으면, fullCategoryIds와 categoryIds를 생성
    const placeCategory: IPlaceCategory =
      await this.generatePlaceCategory(categoryName);

    // fullCategoryIds를 사용하여 캐시에서 가게 카테고리 ID를 조회
    const placeCategoryIdCacheKey = this.generateCacheKey(
      this.redisPlaceCategoryKey,
      placeCategory.fullCategoryIds,
    );
    placeCategoryId = await this.cacheManager.get<number>(
      placeCategoryIdCacheKey,
    );

    if (!placeCategoryId) {
      //없다면, 새로운 카테고리를 placeCategory에 저장
      const newPlaceCategory =
        await this.adminRepository.upsertPlaceCategory(placeCategory);
      placeCategoryId = newPlaceCategory.id;
    }

    //새로운 카테고리를 풀 텍스트로 케시에 저장
    await this.cacheManager.set(fullCategoryPathCacheKey, placeCategoryId, {
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
          const category = await this.adminRepository.upsertCategory(name);
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

  private async resolvePlacePromises(
    placePromises: Promise<BasicPlaceDto>[],
  ): Promise<BasicPlaceDto[]> {
    const results = await Promise.allSettled(placePromises);

    return results.reduce(
      (acc: BasicPlaceDto[], result: PromiseSettledResult<BasicPlaceDto>) => {
        if (result.status === 'rejected') {
          console.error('Failed to process place:', result.reason);
        } else if (result.status === 'fulfilled' && result.value !== null) {
          acc.push(result.value);
        }
        return acc;
      },
      [],
    );
  }
}
