import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { REDIS_KEY } from '../constants/config.constant';
import { redisStore } from 'cache-manager-redis-store';

export const CustomCacheModule = CacheModule.registerAsync({
  isGlobal: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: (await redisStore({
      url: `redis://${configService.get<string>(
        REDIS_KEY.REDIS_URL,
      )}:${configService.get<string>(REDIS_KEY.REDIS_PORT)}`,
    })) as unknown as CacheStore,
  }),
});
