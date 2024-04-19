import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HelpfulReviewService } from '../services/helpful-reviews.service';
import { ApiHelpfulReview } from './swagger/helpful-review.swagger';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';

@Controller('helpful-reviews')
export class HelpfulReviewController {
  constructor(private readonly helpfulReviewService: HelpfulReviewService) {}

  @ApiHelpfulReview.DeleteHelpfulReview({ summary: '도움이 된 리뷰 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteHelpfulReview(
    @Param('id', ParseIntPipe) id: number,
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<void> {
    return this.helpfulReviewService.deleteHelpfulReview(
      id,
      authorizedUser.userId,
    );
  }
}
