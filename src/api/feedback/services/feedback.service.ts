import { Injectable } from '@nestjs/common';
import { FeedbackRepository } from '../repository/feedback.repository';
import { CreateFeedbackDto } from '../dtos/request/create-feedback.dto';
import { DateUtils } from '@src/utils/date.utils';
import { FeedbackLimit } from '../constants/const';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { FeedbackExceptionStatusCode } from '@exceptions/http/enums/feedback.exception.enum';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async createFeedback(userId: number, dto: CreateFeedbackDto): Promise<void> {
    await this.validateUserFeedbackCount(userId);
    await this.feedbackRepository.createUserFeedback(userId, dto);
  }

  private async validateUserFeedbackCount(userId: number): Promise<void> {
    const { convertedStartDate, convertedEndDate } =
      DateUtils.getUTCStartAndEndOfRange();

    const count = await this.feedbackRepository.countUserFeedback(
      userId,
      convertedStartDate,
      convertedEndDate,
    );

    if (count >= FeedbackLimit.DAILY_FEEDBACK_LIMIT) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        FeedbackExceptionStatusCode.DAILY_FEEDBACK_LIMIT_EXCEEDED,
      );
    }
  }
}
