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
}
