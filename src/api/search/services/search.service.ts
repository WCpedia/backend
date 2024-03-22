import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchRepository } from '../repository/search.repository';
import axios, { AxiosResponse } from 'axios';
import { ProductConfigService } from '@core/config/services/config.service';
import { OAUTH_KEY } from '@core/config/constants/config.constant';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { extractRegion } from '@src/utils/region-extractor';
import { Place, PlaceCategory, Prisma, Region } from '@prisma/client';
import {
  IExtractedRegion,
  IPlaceCategory,
  PrismaTransaction,
} from '@src/interface/common.interface';
import {
  IKakaoSearchDocuments,
  IKakaoSearchResponse,
} from '../interface/interface';
import { PlaceSearchResultDto } from '../dtos/response/place-search-result.dto';

@Injectable()
export class SearchService {
  private kakaoSearchUri: string;
  private kakaoAuthKey: string;

  constructor(
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
  }

  async searchPlaces(value: string): Promise<PlaceSearchResultDto[]> {
    const kakaoData: IKakaoSearchDocuments[] =
      await this.fetchKakaoSearchResponse(value);

    return await this.createPlacesFromKakaoData(kakaoData);
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
    return this.prismaService.$transaction((transaction) => {
      return Promise.all(
        kakaoData.map((data) => {
          const categoryPromise = this.upsertPlaceCategory(
            data.category_name,
            transaction,
          );
          const regionPromise = this.getPlaceRegion(data.address_name);

          return Promise.all([categoryPromise, regionPromise]).then(
            ([category, selectedRegion]) => {
              return this.searchRepository.createPlace(
                {
                  kakaoId: data.id,
                  name: data.place_name,
                  placeCategoryId: category.id,
                  regionId: selectedRegion.id,
                  detailAddress: selectedRegion.detailAddress,
                  telephone: data.phone,
                  kakaoUrl: data.place_url,
                  x: parseFloat(data.x),
                  y: parseFloat(data.y),
                },
                transaction,
              );
            },
          );
        }),
      );
    });
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
    transaction: PrismaTransaction,
  ): Promise<PlaceCategory> {
    const placeCategory: IPlaceCategory = await this.generatePlaceCategory(
      categoryName,
      transaction,
    );

    return await this.searchRepository.upsertPlaceCategory(
      placeCategory,
      transaction,
    );
  }

  private async generatePlaceCategory(
    category: string,
    transaction: PrismaTransaction,
  ): Promise<IPlaceCategory> {
    const categoryParts = category.split(' > ');
    const categoryIds = [];
    const placeCategory: IPlaceCategory = {
      fullCategoryIds: null,
      lastDepth: categoryParts.length,
      depth1Id: null,
    };

    for (const [depth, name] of categoryParts.entries()) {
      const category = await this.searchRepository.upsertCategory(
        name,
        transaction,
      );

      categoryIds.push(category.id);
      placeCategory[`depth${depth + 1}Id`] = category.id;
    }
    placeCategory.fullCategoryIds = categoryIds.join('|');

    return placeCategory;
  }
}
