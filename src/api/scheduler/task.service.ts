import { Inject, Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from './repository/task.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ProductConfigService } from '@core/config/services/config.service';
import { REDIS_KEY } from '@core/config/constants/config.constant';

@Injectable()
export class TaskService {
  private readonly topReviewersKey: string;
  private readonly topReviewersTtl: number;

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
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async cacheTopReviewers() {
    try {
      const startTime = Date.now();

      const topReviewers = await this.taskRepository.getTopReviewers();

      //TODO추후 제거
      if (!topReviewers.length) {
        return;
      }

      const userIds = topReviewers.map((review) => review.userId);
      const userProfiles = await this.taskRepository.getUserProfiles(userIds);

      const topReviewersWithProfiles = topReviewers.map((reviewer) => {
        const userProfile = userProfiles.find(
          (profile) => profile.id === reviewer.userId,
        );
        return {
          userId: reviewer.userId,
          reviewCount: reviewer._count.userId,
          nickname: userProfile ? userProfile.nickname : 'Unknown',
          profileImageKey: userProfile
            ? userProfile.profileImageKey
            : 'defaultKey',
        };
      });

      await this.cacheManager.set(
        this.topReviewersKey,
        topReviewersWithProfiles,
        { ttl: this.topReviewersTtl },
      );

      const endTime = Date.now();
      const duration = endTime - startTime;
      Logger.log(`Top reviewers cached in ${duration}ms`, 'CacheTopReviewers');
    } catch (error) {
      Logger.error(
        `Error caching top reviewers: ${error}`,
        'CacheTopReviewers',
      );
    }
  }
}
