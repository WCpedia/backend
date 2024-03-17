import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductConfigService } from './services/config.service';
import { ENVIRONMENT_KEY_VALIDATOR } from './validators';

@Module({
  imports: [ConfigModule.forRoot(ENVIRONMENT_KEY_VALIDATOR)],
  providers: [ProductConfigService],
  exports: [ProductConfigService],
})
export class CustomConfigModule {}
