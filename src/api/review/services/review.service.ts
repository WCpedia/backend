import { Inject, Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repository/review.repository';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductConfigService } from '@core/config/services/config.service';
import { REDIS_KEY } from '@core/config/constants/config.constant';
import { ReviewWithPlaceDto } from '../dtos/response/review-with-place.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
  private redisLatestReviewsTtl: number;
  private redisLatestReviewsKey: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly reviewRepository: ReviewRepository,
    private readonly configService: ProductConfigService,
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
  }

  async getLatestReviews(): Promise<ReviewWithPlaceDto[]> {
    let cachedReviews = await this.getCachedReviews();
    if (!cachedReviews) {
      const reviews = await this.reviewRepository.getLatestReviews();
      cachedReviews = plainToInstance(ReviewWithPlaceDto, reviews);

      await this.cacheReviews(cachedReviews);
    }

    return cachedReviews;
  }

  private async getCachedReviews(): Promise<ReviewWithPlaceDto[] | null> {
    return this.cacheManager.get<ReviewWithPlaceDto[]>(
      this.redisLatestReviewsKey,
    );
  }

  private async cacheReviews(reviews: ReviewWithPlaceDto[]): Promise<void> {
    await this.cacheManager.set(this.redisLatestReviewsKey, reviews, {
      ttl: this.redisLatestReviewsTtl,
    });
  }
}
