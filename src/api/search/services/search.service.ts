import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repository/search.repository';
import axios, { AxiosResponse } from 'axios';
import { ProductConfigService } from '@core/config/services/config.service';
import { OAUTH_KEY } from '@core/config/constants/config.constant';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { extractRegion } from '@src/utils/region-extractor';
import { PlaceCategory, Prisma } from '@prisma/client';
import {
  IExtractedRegion,
  IRegionDepth,
  PrismaTransaction,
} from '@src/interface/common.interface';
import {
  IKakaoSearchDocuments,
  IKakaoSearchResponse,
} from '../interface/interface';

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

  async searchPlaces(value: string) {
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

    return await this.createPlacesFromKakaoData(response.data.documents);
  }

  private async createPlacesFromKakaoData(kakaoData: IKakaoSearchDocuments[]) {
    return await this.prismaService.$transaction(async (transaction) => {
      await Promise.all(
        kakaoData.map(async (data) => {
          return await this.createPlace(data, transaction);
        }),
      );
    });
  }

  private async createPlace(
    data: IKakaoSearchDocuments,
    transaction: PrismaTransaction,
  ) {
    const category = await this.findOrCreateCategory(
      data.category_name,
      transaction,
    );
    const { detailAddress, ...region } = extractRegion(data.address_name);
    const selectedRegion = await this.searchRepository.upsertRegion(
      region,
      transaction,
    );

    return await this.searchRepository.createPlace(
      {
        kakaoId: data.id,
        name: data.place_name,
        placeCategoryId: category.id,
        regionId: selectedRegion.id,
        detailAddress,
        telephone: data.phone,
        kakaoUrl: data.place_url,
        x: parseFloat(data.x),
        y: parseFloat(data.y),
      },
      transaction,
    );
  }

  private async findOrCreateCategory(
    categoryName: string,
    transaction: PrismaTransaction,
  ): Promise<PlaceCategory> {
    const categoryParts = categoryName.split(' > ');
    const categoryIds = await this.upsertCategories(categoryParts, transaction);

    return await this.upsertPlaceCategory(
      categoryIds,
      categoryParts.length,
      transaction,
    );
  }

  private async upsertCategories(
    categoryParts: string[],
    transaction: PrismaTransaction,
  ): Promise<IRegionDepth> {
    const categoryIds = {
      depth1Id: null,
    };

    for (const [depth, name] of categoryParts.entries()) {
      const category = await this.searchRepository.upsertCategory(
        name,
        transaction,
      );

      categoryIds[`depth${depth + 1}Id`] = category.id;
    }

    return categoryIds;
  }

  private async upsertPlaceCategory(
    placeCategory: IRegionDepth,
    lastDepth: number,
    transaction: PrismaTransaction,
  ): Promise<PlaceCategory> {
    const placeCategoryInputData: Prisma.PlaceCategoryCreateInput =
      this.generatePlaceCategoryData(placeCategory, lastDepth);

    let selectedPlaceCategory = await this.searchRepository.findPlaceCategory(
      placeCategory,
      transaction,
    );

    if (!selectedPlaceCategory) {
      return await this.searchRepository.createPlaceCategory(
        placeCategoryInputData,
        transaction,
      );
    }

    return selectedPlaceCategory;
  }

  private generatePlaceCategoryData(
    categoryIds: IRegionDepth,
    lastDepth: number,
  ): Prisma.PlaceCategoryCreateInput {
    return {
      lastDepth,
      oneDepth: { connect: { id: categoryIds.depth1Id } },
      ...(categoryIds.depth2Id && {
        twoDepth: { connect: { id: categoryIds.depth2Id } },
      }),
      ...(categoryIds.depth3Id && {
        threeDepth: { connect: { id: categoryIds.depth3Id } },
      }),
      ...(categoryIds.depth4Id && {
        fourDepth: { connect: { id: categoryIds.depth4Id } },
      }),
      ...(categoryIds.depth5Id && {
        fiveDepth: { connect: { id: categoryIds.depth5Id } },
      }),
    };
  }
}
