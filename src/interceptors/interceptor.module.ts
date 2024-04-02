import { Module } from '@nestjs/common';
import { SuccessInterceptor } from './success.interceptor';
import { FormDataJsonInterceptor } from './form-data.interceptor';

@Module({
  providers: [SuccessInterceptor, FormDataJsonInterceptor],
})
export class InterceptorModule {}
