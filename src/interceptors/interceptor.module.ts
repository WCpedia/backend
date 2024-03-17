import { Module } from '@nestjs/common';
import { SuccessInterceptor } from './global/success.interceptor';

@Module({
  providers: [SuccessInterceptor],
})
export class InterceptorModule {}
