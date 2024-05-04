import { Inject, Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repository/review.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductConfigService } from '@core/config/services/config.service';
import { REDIS_KEY } from '@core/config/constants/config.constant';
import { DetailReviewWithoutHelpfulDto } from '../dtos/response/review-with-place.dto';
import { plainToInstance } from 'class-transformer';
import { TopReviewersDto } from '../dtos/response/top-reviewers.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import {
  HelpfulReview,
  Place,
  PlaceReview,
  Prisma,
  ReviewImage,
  User,
} from '@prisma/client';
import { HelpfulReviewDto } from '@api/common/dto/reveiw-reaction.dto';
import { UpdatePlaceReviewDto } from '../dtos/request/update-place-review.dto';
import { extractS3Key } from '@src/utils/s3-url-transformer';
import { AwsS3Service } from '@core/aws/s3/services/aws-s3.service';
import { UploadFileLimit } from '@src/constants/consts/upload-file.const';
import { IComparedReviewImages } from '../interface/interface';
import { ICalculatedRating } from '@api/place/interface/interface';
import { RatingTypes } from '@api/place/constants/const/const';

@Injectable()
export class ReviewService {
  private redisLatestReviewsTtl: number;
  private redisLatestReviewsKey: string;
  private redisTopReviewersKey: string;
  private redisTopReviewersTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly reviewRepository: ReviewRepository,
    private readonly configService: ProductConfigService,
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.initializeRedisConfig();
  }

  private initializeRedisConfig(): void {
    this.redisLatestReviewsTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_LATEST_REVIEW_TTL,
    );
    this.redisLatestReviewsKey = this.configService.get<string>(
      REDIS_KEY.REDIS_LATEST_REVIEW_KEY,
    );
    this.redisTopReviewersKey = this.configService.get<string>(
      REDIS_KEY.REDIS_TOP_REVIEWERS_KEY,
    );
    this.redisTopReviewersTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_TOP_REVIEWERS_TTL,
    );
  }

  async getLatestReviews(): Promise<DetailReviewWithoutHelpfulDto[]> {
    return await this.cacheManager.get(this.redisLatestReviewsKey);
  }

  async getTopReviewers(): Promise<TopReviewersDto[]> {
    return await this.cacheManager.get(this.redisTopReviewersKey);
  }

  async createHelpfulReview(
    reviewId: number,
    userId: number,
  ): Promise<HelpfulReview> {
    const selectedReview = await this.reviewRepository.getReview(reviewId);
    if (!selectedReview) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        ReviewExceptionEnum.REVIEW_NOT_EXIST,
      );
    }
    if (selectedReview.userId === userId) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.SELF_HELPFUL_REVIEW_FORBIDDEN,
      );
    }

    const isExist = await this.reviewRepository.countHelpfulReview(
      reviewId,
      userId,
    );
    if (isExist) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.ALREADY_HELPFUL_REVIEWED,
      );
    }

    const result = await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        return await Promise.all([
          this.reviewRepository.createHelpfulReview(
            reviewId,
            userId,
            transaction,
          ),
          this.reviewRepository.updateHelpfulCount(reviewId, true, transaction),
        ]);
      },
    );

    return plainToInstance(HelpfulReviewDto, result[0]);
  }

  async updateReview(
    userId: number,
    reviewId: number,
    updatePlaceReviewDto: UpdatePlaceReviewDto,
    newImages: Express.MulterS3.File[],
  ) {
    const { imageUrls, ...updateReviewDto } = updatePlaceReviewDto;

    const { place, ...userReview } = await this.getUserReview(userId, reviewId);
    const selectedUser = await this.reviewRepository.getUser(userId);

    const { imagesToAdd, imagesToDelete } = await this.compareReviewImages(
      updatePlaceReviewDto.imageUrls,
      newImages,
      userReview.images,
    );

    const { userRatingAverage, ...updatedPlaceRatings } =
      this.calculateUpdatedRating(
        place,
        selectedUser,
        userReview,
        updatePlaceReviewDto,
      );

    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.reviewRepository.updateUserReview(
          reviewId,
          updateReviewDto,
          transaction,
        );
        await this.reviewRepository.updatePlaceRating(
          place.id,
          updatedPlaceRatings,
          transaction,
        );
        await this.reviewRepository.updateUserRating(
          userId,
          userRatingAverage,
          transaction,
        );
        await this.reviewRepository.updateReviewImages(
          reviewId,
          imagesToAdd,
          imagesToDelete,
          transaction,
        );
      },
      { isolationLevel: 'Serializable' },
    );
  }

  private async getUserReview(userId: number, reviewId: number) {
    const review = await this.reviewRepository.getReviewWithPlace(reviewId);
    if (review.userId !== userId) {
      throw new CustomException(
        HttpExceptionStatusCode.FORBIDDEN,
        ReviewExceptionEnum.MISMATCHED_AUTHOR,
      );
    }

    return review;
  }

  private async compareReviewImages(
    newImageUrl: string[],
    newImageFiles: Express.MulterS3.File[],
    reviewImages: ReviewImage[],
  ): Promise<IComparedReviewImages> {
    const newImageKeys = await this.extractImageKeys(
      newImageUrl,
      newImageFiles,
    );
    const currentImageKeys = reviewImages.map((image) => image.key);

    // 새로운 이미지 키 중에서 현재 이미지 키에 없는 것을 찾아 추가할 이미지 목록을 생성
    const imagesToAdd = newImageKeys.filter(
      (key) => !currentImageKeys.includes(key),
    );

    // 현재 이미지 키 중에서 새로운 이미지 키에 없는 것을 찾아 삭제할 이미지 목록을 생성
    const imagesToDelete = reviewImages
      .filter((image) => !newImageKeys.includes(image.key))
      .map((image) => image.id);

    return { imagesToAdd, imagesToDelete };
  }

  private async extractImageKeys(
    images: string[],
    newImages: Express.MulterS3.File[],
  ): Promise<string[]> {
    let extractedImageKeys: string[] = [];
    images.map((image) => extractedImageKeys.push(extractS3Key(image)));
    newImages.map((image) => extractedImageKeys.push(image.key));

    if (extractedImageKeys.length > UploadFileLimit.REVIEW_IMAGES) {
      await this.deleteS3Object(extractedImageKeys);

      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.REVIEW_IMAGE_LIMIT_EXCEEDED,
      );
    }

    return extractedImageKeys;
  }

  private async deleteS3Object(imageKeys: string[]): Promise<void> {
    if (imageKeys.length === 0) {
      return;
    }

    await this.awsS3Service.deleteMany(imageKeys);
  }

  private calculateUpdatedRating(
    place: Place,
    userProfile: User,
    oldRatings: PlaceReview,
    newRatings: UpdatePlaceReviewDto,
  ): ICalculatedRating {
    const placeReviewCount = place.reviewCount;
    let totalNewRating = 0;
    let totalOldRating = 0;

    const updateData = RatingTypes.reduce((acc, ratingType) => {
      const oldRating = oldRatings[ratingType];
      const newRating = newRatings[ratingType];

      totalOldRating += oldRating;
      totalNewRating += newRating;

      const currentRating = place[ratingType];
      const updatedRating =
        (currentRating * placeReviewCount - oldRating + newRating) /
        placeReviewCount;
      acc[ratingType] = Math.round(updatedRating * 100) / 100;

      return acc;
    }, {} as ICalculatedRating);

    // 모든 평가 항목에 대한 계산이 완료된 후 userRatingAverage를 계산
    updateData.userRatingAverage =
      Math.round(
        ((userProfile.ratingAverage * userProfile.totalReviewCount -
          totalOldRating +
          totalNewRating) /
          userProfile.totalReviewCount) *
          100,
      ) / 100;

    return updateData;
  }
}
