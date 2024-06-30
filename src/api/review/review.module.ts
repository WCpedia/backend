import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { ReviewRepository } from './repository/review.repository';
import { ReviewService } from './services/review.service';
import { CustomConfigModule } from '@core/config/config.module';
import { HelpfulReviewController } from './controllers/helpful-review.controller';
import { HelpfulReviewService } from './services/helpful-reviews.service';
import { AwsS3Module } from '@core/aws/s3/aws-s3.module';

@Module({
  imports: [CustomConfigModule, AwsS3Module],
  controllers: [ReviewController, HelpfulReviewController],
  providers: [ReviewService, HelpfulReviewService, ReviewRepository],
  exports: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
