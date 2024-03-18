import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
})
export class ApiModule {}
