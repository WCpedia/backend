import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewRepository } from './repository/review.repository';
import { ReviewService } from './services/review.service';
import { CustomConfigModule } from '@core/config/config.module';

@Module({
  imports: [CustomConfigModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
