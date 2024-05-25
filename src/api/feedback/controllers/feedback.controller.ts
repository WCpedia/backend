import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { CreateFeedbackDto } from '../dtos/request/create-feedback.dto';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { ApiFeedback } from './swagger/feedback.swagger';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';

@ApiTags(DOMAIN_NAME.FEEDBACK)
@Controller(DOMAIN_NAME.FEEDBACK)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiFeedback.CreateFeedback({ summary: '유저 피드백 생성' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createFeedback(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<void> {
    await this.feedbackService.createFeedback(
      authorizedUser.userId,
      createFeedbackDto,
    );
  }
}
