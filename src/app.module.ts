import { ApiModule } from '@api/api.module';
import { CoreModule } from '@core/core.module';
import { InterceptorModule } from '@interceptors/interceptor.module';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [CoreModule, ApiModule, InterceptorModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
