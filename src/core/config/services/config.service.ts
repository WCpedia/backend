import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CONFIG_ENVIRONMENT,
  ENVIRONMENT_KEY,
} from '../constants/config.constant';

@Injectable()
export class ProductConfigService {
  constructor(
    private readonly configService: ConfigService<typeof ENVIRONMENT_KEY, true>,
  ) {}

  get<T>(key: (typeof ENVIRONMENT_KEY)[keyof typeof ENVIRONMENT_KEY]): T {
    return this.configService.get<T>(key);
  }

  isLocal(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) === CONFIG_ENVIRONMENT.LOCAL
    );
  }

  isDevelopment(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      CONFIG_ENVIRONMENT.DEVELOPMENT
    );
  }

  isProduction(): boolean {
    return (
      this.get<string>(ENVIRONMENT_KEY.NODE_ENV) ===
      CONFIG_ENVIRONMENT.PRODUCTION
    );
  }
}
