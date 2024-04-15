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
  PlaceReview,
  Prisma,
  Region,
  User,
} from '@prisma/client';
import {
  IKakaoSearchImageDocuments,
  IKakaoSearchImageResponse,
  IKakaoPlaceMenuInfo,
  IPlaceUpdateRatingInput,
  ICalculatedRating,
} from '@api/place/interface/interface';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { PlaceExceptionEnum } from '@exceptions/http/enums/place.exception.enum';
import { ReviewWithDetailsDto } from '../../common/dto/review-with-details.dto';
import { MyPlaceReviewDto } from '../dtos/response/my-place-review.dto';
import { GetPlaceReviewDto } from '../dtos/request/get-place-review.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { ReportFacilityDto } from '../dtos/request/report-facility.dto';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { RatingTypes } from '../constants/const/const';
import { UserExceptionEnum } from '@exceptions/http/enums/user.exception.enum';

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

  async getPlaceByPlaceId(
    placeId: number,
    userId?: number,
  ): Promise<PlaceDetailDto> {
    let myReview = null;

    const selectedPlace = await this.placeRepository.getPlaceWithDetailsById(
      placeId,
      userId,
    );
    if (!selectedPlace) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        PlaceExceptionEnum.PLACE_NOT_FOUND,
      );
    }
    const totalReviewCount = await this.placeRepository.countReview(placeId);

    if (!selectedPlace.isInitial) {
      await this.prismaService.$transaction(
        async (transaction: Prisma.TransactionClient) => {
          await this.ensurePlaceImages(transaction, selectedPlace);
          await this.ensureMenuInfo(transaction, selectedPlace);
          await this.placeRepository.updatePlaceIsInitial(placeId, transaction);
        },
      );
    }

    if (totalReviewCount && userId) {
      myReview = await this.placeRepository.getPlaceReviewByUserId(
        placeId,
        userId,
      );
    }

    return plainToInstance(PlaceDetailDto, {
      ...selectedPlace,
      totalReviewCount,
      myReview,
    });
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
  ): Promise<void> {
    const selectedPlace = await this.getPlaceById(placeId);
    await this.checkReviewNotExist(placeId, userId);
    const userprofile = await this.getUserProfile(userId);

    const { userRatingAverage, ...calculatedRating } = this.calculateRating(
      selectedPlace,
      userprofile,
      dto,
    );

    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.placeRepository.createPlaceReview(
          placeId,
          userId,
          dto,
          reviewImages,
          transaction,
        );
        await this.placeRepository.updatePlaceRating(
          placeId,
          calculatedRating,
          transaction,
        );
        await this.placeRepository.updateUserRating(
          userId,
          userRatingAverage,
          transaction,
        );
      },
    );
  }

  private async checkReviewNotExist(
    placeId: number,
    userId: number,
  ): Promise<void> {
    const selectedReview = await this.placeRepository.getPlaceReviewByUserId(
      placeId,
      userId,
    );
    if (selectedReview) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.ALREADY_REVIEWED,
      );
    }
  }

  private async getPlaceById(placeId: number): Promise<Place> {
    const selectedPlace = await this.placeRepository.getPlaceById(placeId);
    if (!selectedPlace) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        PlaceExceptionEnum.PLACE_NOT_FOUND,
      );
    }

    return selectedPlace;
  }

  private async getUserProfile(userId: number) {
    const userProfile = await this.placeRepository.getUserById(userId);
    if (!userProfile) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        UserExceptionEnum.USER_NOT_FOUND,
      );
    }

    return userProfile;
  }

  async getPlaceReviewsByPlaceId(
    placeId: number,
    { take, lastItemId }: GetPlaceReviewDto,
    userId?: number,
  ): Promise<PaginatedResponse<ReviewWithDetailsDto, 'reviews'>> {
    const totalItemCount = await this.placeRepository.countReview(placeId);
    if (!totalItemCount) {
      return { totalItemCount, reviews: [] };
    }
    const paginationParams = generatePaginationParams({ take, lastItemId });

    const reviews =
      await this.placeRepository.getPlaceReviewWithDetailsByPlaceId(
        placeId,
        paginationParams,
        userId,
      );

    return {
      totalItemCount,
      reviews: plainToInstance(ReviewWithDetailsDto, reviews),
    };
  }

  private calculateRating(
    place: Place,
    userprofile: User,
    dto: CreatePlaceReviewDto,
  ): ICalculatedRating {
    const updatedCount = place.reviewCount + 1;
    let totalNewRating = 0;

    const updateData = RatingTypes.reduce((acc, ratingType) => {
      const newRating = dto[ratingType];
      totalNewRating += newRating;
      const currentRating = place[ratingType];
      const updatedRating =
        currentRating === null
          ? newRating
          : (currentRating * place.reviewCount + newRating) / updatedCount;

      acc[ratingType] = Math.round(updatedRating * 100) / 100;
      return acc;
    }, {} as ICalculatedRating);

    // 모든 평가 항목에 대한 계산이 완료된 후 userRatingAverage를 계산
    updateData.userRatingAverage =
      Math.round(
        ((userprofile.ratingAverage * userprofile.totalReviewCount +
          totalNewRating / RatingTypes.length) /
          (userprofile.totalReviewCount + 1)) *
          100,
      ) / 100;
    updateData.reviewCount = updatedCount;

    return updateData;
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

  async reportFacility(
    placeId: number,
    userId: number,
    dto: ReportFacilityDto,
    reportImages: Express.MulterS3.File[],
  ): Promise<void> {
    await this.getPlaceById(placeId);

    await this.placeRepository.createPlaceReport(
      placeId,
      userId,
      dto,
      reportImages,
    );
  }
}
