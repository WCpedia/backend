import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service';
import { DetailReviewWithoutHelpfulDto } from '../dtos/response/review-with-place.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiReview } from './swagger/review.swagger';
import { TopReviewersDto } from '../dtos/response/top-reviewers.dto';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';

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

  @ApiReview.CreateHelpfulReview({ summary: '도움이 된 리뷰 추가' })
  @UseGuards(AccessTokenGuard)
  @Post(':reviewId/helpful')
  async createHelpfulReview(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reviewId', ParseIntPipe) placeId: number,
  ): Promise<void> {
    return this.reviewService.createHelpfulReview(
      placeId,
      authorizedUser.userId,
    );
  }
}
