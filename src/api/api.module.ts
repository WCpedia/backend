import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { NicknameNotExistValidator } from './common/validators/nickname-not-exist.validator';

@Module({
  providers: [NicknameNotExistValidator],
  imports: [CoreModule, AuthModule],
})
export class ApiModule {}
