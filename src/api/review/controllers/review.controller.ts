import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { DetailReviewWithoutHelpfulDto } from '../dtos/response/review-with-place.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiReview } from './swagger/review.swagger';
import { TopReviewersDto } from '../dtos/response/top-reviewers.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiReview.GetLatestReviews({ summary: '최신 리뷰 목록 조회' })
  @Get('/latest')
  async getLatestReviews(): Promise<DetailReviewWithoutHelpfulDto[]> {
    return this.reviewService.getLatestReviews();
  }

  @ApiReview.GetTopReviewers({ summary: 'Top 리뷰어 목록 조회' })
  @Get('/top-reviewers')
  async getTopReviewers(): Promise<TopReviewersDto[]> {
    return this.reviewService.getTopReviewers();
  }
}
