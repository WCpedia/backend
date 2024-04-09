import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { ReviewWithPlaceDto } from '../dtos/response/review-with-place.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiReview } from './swagger/review.swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiReview.GetLatestReviews({ summary: '최신 리뷰 목록 조회' })
  @Get('/latest')
  async getLatestReviews(): Promise<ReviewWithPlaceDto[]> {
    return this.reviewService.getLatestReviews();
  }
}
