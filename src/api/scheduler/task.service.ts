import { Inject, Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from './repository/task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductConfigService } from '@core/config/services/config.service';
import { REDIS_KEY } from '@core/config/constants/config.constant';
import { plainToInstance } from 'class-transformer';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { TopReviewerWithCount } from './type/type';
import { TopReviewerDto } from './dtos/top-reviewer.dto';

@Injectable()
export class TaskService {
  private readonly topReviewersKey: string;
  private readonly topReviewersTtl: number;
  private readonly latestReviewsKey: string;
  private readonly latestReviewsTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly taskRepository: TaskRepository,
    private readonly configService: ProductConfigService,
  ) {
    this.topReviewersKey = this.configService.get<string>(
      REDIS_KEY.REDIS_TOP_REVIEWERS_KEY,
    );
    this.topReviewersTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_TOP_REVIEWERS_TTL,
    );
    this.latestReviewsKey = this.configService.get<string>(
      REDIS_KEY.REDIS_LATEST_REVIEW_KEY,
    );
    this.latestReviewsTtl = this.configService.get<number>(
      REDIS_KEY.REDIS_LATEST_REVIEW_TTL,
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cacheTopReviewers() {
    await this.cacheData(
      this.getTopReviewers.bind(this),
      this.topReviewersKey,
      this.topReviewersTtl,
      'Top reviewers',
      (topReviewers) => plainToInstance(TopReviewerDto, topReviewers),
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cacheLatestReviews() {
    await this.cacheData(
      this.taskRepository.getLatestReviews.bind(this.taskRepository),
      this.latestReviewsKey,
      this.latestReviewsTtl,
      'Latest reviews',
      (reviews) => plainToInstance(DetailReviewWithoutHelpfulDto, reviews),
    );
  }

  private async getTopReviewers(): Promise<TopReviewerDto[]> {
    const topReviewers: TopReviewerWithCount[] =
      await this.taskRepository.getTopReviewers();

    const userIds = topReviewers.map((review) => review.userId);

    const userProfiles = await this.taskRepository.getUserProfiles(userIds);
    const profilesMap = new Map(
      userProfiles.map((profile) => [profile.id, profile]),
    );

    return topReviewers.map(({ userId, _count }) => ({
      weeklyReviewCount: _count.userId,
      url: null,
      ...profilesMap.get(userId),
    }));
  }

  private async cacheData(
    fetchData: () => Promise<any[]>,
    cacheKey: string,
    ttl: number,
    logTitle: string,
    transformData: (data: any[]) => any,
  ) {
    const startTime = Date.now();

    const data = await fetchData();
    if (!data) {
      Logger.error(
        `Data Empty: ${logTitle}`,
        `Cache${logTitle.replace(/\s/g, '')}`,
      );
      return;
    }

    const transformedData = transformData(data);
    await this.cacheManager.set(cacheKey, transformedData, { ttl });

    const endTime = Date.now();
    const duration = endTime - startTime;
    Logger.log(
      `${logTitle} cached in ${duration}ms`,
      `Cache${logTitle.replace(/\s/g, '')}`,
    );
  }
}
