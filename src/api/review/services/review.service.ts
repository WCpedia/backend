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
import { HelpfulReview, Prisma } from '@prisma/client';
import { HelpfulReviewDto } from '@api/common/dto/reveiw-reaction.dto';
import { UpdatePlaceReviewDto } from '../dtos/request/update-place-review.dto';
import { extractS3Key } from '@src/utils/s3-url-transformer';
import { AwsS3Service } from '@core/aws/s3/services/aws-s3.service';
import { IComparedReviewImages } from '../interface/interface';
import { RatingCalculator } from '@src/utils/rating-calculator';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import { Review } from '../review';
import { IPlaceUpdateRatingInput } from '@api/place/interface/interface';

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
    const selectedReview = await this.validateReviewExists(reviewId);
    selectedReview.validateNotAuthor(userId);

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

  private async validateReviewExists(
    reviewId: number,
    includeImages: boolean = false,
  ): Promise<Review> {
    const review = includeImages
      ? await this.reviewRepository.getReviewWithImages(reviewId)
      : await this.reviewRepository.getReview(reviewId);

    if (!review) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        ReviewExceptionEnum.REVIEW_NOT_EXIST,
      );
    }

    return review;
  }

  async updateReview(
    userId: number,
    reviewId: number,
    { imageUrls, ...newReview }: UpdatePlaceReviewDto,
    newImages: Express.MulterS3.File[],
  ) {
    try {
      const oldReview = await this.validateReviewExists(reviewId, true);
      oldReview.validateAuthor(userId);

      const selectedPlace = await this.reviewRepository.getPlace(
        oldReview.placeId,
      );
      const selectedUser = await this.reviewRepository.getUserById(userId);

      const updatedReviewImages = Review.updateImages(
        imageUrls,
        newImages,
        oldReview.images,
      );
      const { userRatingAverage, ...calculatedPlaceRatings } = RatingCalculator(
        selectedPlace,
        selectedUser,
        CalculateOperation.UPDATE,
        newReview,
        oldReview.rating,
      );
      const updatedReview = Review.update(oldReview, newReview);

      await this.trxUpdateReview(
        updatedReview,
        calculatedPlaceRatings,
        userId,
        userRatingAverage,
        updatedReviewImages,
      );
    } catch (error) {
      if (
        error instanceof CustomException &&
        error.errorCode === ReviewExceptionEnum.REVIEW_IMAGE_LIMIT_EXCEEDED
      ) {
        await this.handleInvalidImages(newImages);
      }

      throw error;
    }
  }

  private async trxUpdateReview(
    updatedReview: Review,
    calculatedPlaceRatings: IPlaceUpdateRatingInput,
    userId: number,
    userRatingAverage: number,
    updatedReviewImages: IComparedReviewImages,
  ): Promise<void> {
    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.reviewRepository.updateUserReview(
          updatedReview,
          transaction,
        );
        await this.reviewRepository.updatePlaceRating(
          updatedReview.placeId,
          calculatedPlaceRatings,
          transaction,
        );
        await this.reviewRepository.updateUserRating(
          CalculateOperation.UPDATE,
          userId,
          userRatingAverage,
          transaction,
        );
        await this.reviewRepository.createReviewImages(
          updatedReview.id,
          updatedReviewImages.imagesToAdd,
          transaction,
        );
        await this.reviewRepository.softDeleteReviewImages(
          updatedReviewImages.imagesToDelete,
          transaction,
        );
        await this.reviewRepository.createReviewSnapshot(
          updatedReview,
          transaction,
        );
      },
      { isolationLevel: 'Serializable' },
    );
  }

  private async handleInvalidImages(
    invalidImages: Express.MulterS3.File[],
  ): Promise<void> {
    const invalidImageKeys = invalidImages.map((image) =>
      extractS3Key(image.key),
    );

    await this.awsS3Service.deleteMany(invalidImageKeys);
    throw new CustomException(
      HttpExceptionStatusCode.BAD_REQUEST,
      ReviewExceptionEnum.REVIEW_IMAGE_LIMIT_EXCEEDED,
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

  async deleteReview(userId: number, reviewId: number) {
    const { place, ...oldReview } = await this.getUserReview(userId, reviewId);
    const selectedUser = await this.reviewRepository.getUserById(userId);
    const { userRatingAverage, ...calculatedPlaceRatings } = RatingCalculator(
      place,
      selectedUser,
      CalculateOperation.DELETE,
      undefined,
      oldReview,
    );

    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.reviewRepository.softDeleteReview(reviewId, transaction);
        await this.reviewRepository.updatePlaceRating(
          place.id,
          calculatedPlaceRatings,
          transaction,
        );
        await this.reviewRepository.updateUserRating(
          CalculateOperation.DELETE,
          userId,
          userRatingAverage,
          transaction,
        );
      },
      { isolationLevel: 'Serializable' },
    );
  }
}
