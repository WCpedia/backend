import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
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
import { HelpfulReview } from '@prisma/client';
import { ReviewExistenceValidationPipe } from '../validators/user-existence-validator';
import { UploadImages } from '@src/utils/image-upload-interceptor';
import {
  FilePath,
  UploadFileLimit,
} from '@src/constants/consts/upload-file.const';
import { UpdatePlaceReviewDto } from '../dtos/request/update-place-review.dto';

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

  @ApiReview.UpdateReview({ summary: '리뷰 수정' })
  @UploadImages({
    maxCount: UploadFileLimit.REVIEW_IMAGES,
    path: FilePath.REVIEW,
  })
  @UseGuards(AccessTokenGuard)
  @Patch(':reviewId')
  async updateReview(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reviewId', ParseIntPipe, ReviewExistenceValidationPipe)
    reviewId: number,
    @UploadedFiles() newImages: Express.MulterS3.File[],
    @Body() updatePlaceReviewDto: UpdatePlaceReviewDto,
  ): Promise<void> {
    return this.reviewService.updateReview(
      authorizedUser.userId,
      reviewId,
      updatePlaceReviewDto,
      newImages,
    );
  }

  @ApiReview.DeleteReview({ summary: '리뷰 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete(':reviewId')
  async deleteReview(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reviewId', ParseIntPipe, ReviewExistenceValidationPipe)
    reviewId: number,
  ) {
    return this.reviewService.deleteReview(authorizedUser.userId, reviewId);
  }

  @ApiReview.CreateHelpfulReview({ summary: '도움이 된 리뷰 추가' })
  @UseGuards(AccessTokenGuard)
  @Post(':reviewId/helpful')
  async createHelpfulReview(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('reviewId', ParseIntPipe) placeId: number,
  ): Promise<HelpfulReview> {
    return this.reviewService.createHelpfulReview(
      placeId,
      authorizedUser.userId,
    );
  }
}
