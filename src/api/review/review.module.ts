import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewRepository } from './repository/review.repository';
import { ReviewService } from './services/review.service';
import { CustomConfigModule } from '@core/config/config.module';
import { HelpfulReviewController } from './controllers/helpful-review.controller';
import { HelpfulReviewService } from './services/helpful-reviews.service';

@Module({
  imports: [CustomConfigModule],
  controllers: [ReviewController, HelpfulReviewController],
  providers: [ReviewService, HelpfulReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewModule {}
