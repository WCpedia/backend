import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config/config.module';
import { CustomCacheModule } from './config/modules/cache-module.config';
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [CustomConfigModule, PrismaModule, CustomCacheModule],
})
export class CoreModule {}
