import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PlaceRepository } from '@api/place/repository/place.repository';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { ProductConfigService } from '@core/config/services/config.service';
import { plainToInstance } from 'class-transformer';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';
import { OAUTH_KEY } from '@core/config/constants/config.constant';
import axios, { AxiosResponse } from 'axios';
import {
  Category,
  MenuInfo,
  Place,
  PlaceCategory,
  PlaceImage,
  Prisma,
  Region,
} from '@prisma/client';
import {
  IKakaoSearchImageDocuments,
  IKakaoSearchImageResponse,
  IKakaoPlaceMenuInfo,
  IPlaceUpdateRatingInput,
} from '@api/place/interface/interface';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { PlaceExceptionEnum } from '@exceptions/http/enums/place.exception.enum';
import { PlaceReviewWithDetailsDto } from '../dtos/response/place-review.dto';
import { MyPlaceReviewDto } from '../dtos/response/my-place-review.dto';

@Injectable()
export class PlaceService {
  private kakaoSearchImageUri: string;
  private kakaoAuthKey: string;
  private kakaoSearchImageMaxSize: number;
  private kakaoMenuUri: string;

  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly configService: ProductConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.kakaoSearchImageUri = this.configService.get<string>(
      OAUTH_KEY.KAKAO_SEARCH_IMAGE_URI,
    );
    this.kakaoAuthKey = this.configService.get<string>(
      OAUTH_KEY.KAKAO_AUTHORIZATION_KEY,
    );
    this.kakaoSearchImageMaxSize = this.configService.get<number>(
      OAUTH_KEY.KAKAO_SEARCH_IMAGE_MAX_SIZE,
    );
    this.kakaoMenuUri = this.configService.get<string>(
      OAUTH_KEY.KAKAO_MENU_URI,
    );
  }

  async getPlaceByPlaceId(placeId: number): Promise<PlaceDetailDto> {
    const selectedPlace =
      await this.placeRepository.getPlaceWithDetailsById(placeId);
    if (!selectedPlace) {
      throw new InternalServerErrorException('장소를 찾을 수 없습니다.');
    }

    if (!selectedPlace.isInitial) {
      await this.prismaService.$transaction(
        async (transaction: Prisma.TransactionClient) => {
          await this.ensurePlaceImages(transaction, selectedPlace);
          await this.ensureMenuInfo(transaction, selectedPlace);
          await this.placeRepository.updatePlaceIsInitial(placeId, transaction);
        },
      );
    }

    return plainToInstance(PlaceDetailDto, selectedPlace);
  }

  private async ensurePlaceImages(
    transaction: Prisma.TransactionClient,
    place: Place & { region: Region; images: PlaceImage[] },
  ) {
    const placeImages = await this.fetchKakaoSearchImages(place);
    if (placeImages.length === 0) {
      return;
    }

    await this.placeRepository.createPlaceImages(
      place.id,
      placeImages,
      transaction,
    );
    place.images = await this.placeRepository.getPlaceImages(
      place.id,
      transaction,
    );
  }

  private async fetchKakaoSearchImages(
    place: Place & { region: Region },
  ): Promise<IKakaoSearchImageDocuments[]> {
    const queries = [
      `${place.detailAddress} ${place.name}`,
      `${place.region.administrativeDistrict} ${place.region.district} ${place.name}`,
      place.name,
    ];

    for (const query of queries) {
      const response = await axios.get<IKakaoSearchImageResponse>(
        this.kakaoSearchImageUri,
        {
          headers: {
            Authorization: this.kakaoAuthKey,
            'Content-type': 'application/x-www-form-urlencoded',
          },
          params: { query, size: this.kakaoSearchImageMaxSize },
        },
      );

      if (response.data.documents.length > 0) {
        return response.data.documents;
      }
    }
    return [];
  }

  private async ensureMenuInfo(
    transaction: Prisma.TransactionClient,
    place: Place & {
      placeCategory: PlaceCategory & { depth1: Category };
      menuInfo: MenuInfo[];
    },
  ) {
    const menuList = await this.fetchKakaoMenuInfo(place.kakaoId);
    if (menuList.length === 0) {
      return;
    }

    await this.placeRepository.createPlaceMenuInfo(
      place.id,
      menuList,
      transaction,
    );

    place.menuInfo = await this.placeRepository.getPlaceMenuInfo(
      place.id,
      transaction,
    );
  }

  async fetchKakaoMenuInfo(kakaoId: string) {
    const response = await axios.get<IKakaoPlaceMenuInfo>(
      `${this.kakaoMenuUri}/${kakaoId}`,
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data.menuInfo.menuList.length
      ? response.data.menuInfo.menuList
      : [];
  }

  async createPlaceReview(
    placeId: number,
    userId: number,
    dto: CreatePlaceReviewDto,
    reviewImages: Express.MulterS3.File[],
  ) {
    const selectedPlace = await this.checkPlaceExist(placeId);
    const selectedReview = await this.placeRepository.getPlaceReviewByUserId(
      placeId,
      userId,
    );
    if (selectedReview) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        PlaceExceptionEnum.ALREADY_REVIEWED,
      );
    }

    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.placeRepository.createPlaceReview(
          placeId,
          userId,
          dto,
          reviewImages,
          transaction,
        );
        await this.updatePlaceRating(selectedPlace, dto, transaction);
      },
    );
  }

  private async checkPlaceExist(placeId: number): Promise<Place> {
    const selectedPlace = await this.placeRepository.getPlaceById(placeId);
    if (!selectedPlace) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        PlaceExceptionEnum.PLACE_NOT_FOUND,
      );
    }
    return selectedPlace;
  }

  private async updatePlaceRating(
    place: Place,
    dto: CreatePlaceReviewDto,
    transaction: Prisma.TransactionClient,
  ): Promise<void> {
    const ratingsToUpdate = [
      'overallRating',
      'scentRating',
      'cleanlinessRating',
    ] as const;

    const updateData = ratingsToUpdate.reduce((acc, ratingType) => {
      const { updatedRating, updatedCount } = this.calculateNewRatingAndCount(
        place[ratingType],
        place[`${ratingType}Count`],
        dto[ratingType],
      );
      acc[ratingType] = updatedRating;
      acc[`${ratingType}Count`] = updatedCount;
      return acc;
    }, {} as IPlaceUpdateRatingInput);

    await this.placeRepository.updatePlaceRating(
      place.id,
      updateData,
      transaction,
    );
  }

  private calculateNewRatingAndCount(
    currentRating: number | null,
    currentCount: number | null,
    newRating: number | undefined,
  ): { updatedRating: number | null; updatedCount: number | null } {
    if (newRating === undefined) {
      return { updatedRating: currentRating, updatedCount: currentCount };
    }
    const updatedCount = (currentCount ?? 0) + 1;
    const updatedRating =
      currentRating === null
        ? newRating
        : Math.round(
            ((currentRating * (updatedCount - 1) + newRating) / updatedCount) *
              100,
          ) / 100;

    return { updatedRating, updatedCount };
  }

  async getPlaceReviewsByPlaceId(
    placeId: number,
    userId?: number,
  ): Promise<PlaceReviewWithDetailsDto[]> {
    const reviews =
      await this.placeRepository.getPlaceReviewWithDetailsByPlaceId(
        placeId,
        userId,
      );

    return plainToInstance(PlaceReviewWithDetailsDto, reviews);
  }

  async getMyPlaceReview(
    placeId: number,
    userId: number,
  ): Promise<MyPlaceReviewDto> {
    const review = await this.placeRepository.getPlaceReviewWithDetailsByUserId(
      placeId,
      userId,
    );

    return plainToInstance(MyPlaceReviewDto, review);
  }
}
