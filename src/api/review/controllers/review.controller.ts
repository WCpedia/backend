import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { ReviewWithPlaceDto } from '../dtos/response/review-with-place.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/latest')
  async getLatestReviews(): Promise<ReviewWithPlaceDto[]> {
    return this.reviewService.getLatestReviews();
  }
}
