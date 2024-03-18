import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomCacheModule } from './config/modules/cache-module.config';

@Module({
  imports: [CustomConfigModule, DatabaseModule, CustomCacheModule],
})
export class CoreModule {}
