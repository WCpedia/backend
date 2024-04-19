import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repository/review.repository';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { PrismaService } from '@core/database/prisma/services/prisma.service';

@Injectable()
export class HelpfulReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async deleteHelpfulReview(id: number, userId: number): Promise<void> {
    const selectedHelpfulReview =
      await this.reviewRepository.getHelpfulReview(id);
    if (!selectedHelpfulReview) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        ReviewExceptionEnum.HELPFUL_REVIEW_NOT_EXIST,
      );
    }
    if (selectedHelpfulReview.userId !== userId) {
      throw new CustomException(
        HttpExceptionStatusCode.FORBIDDEN,
        ReviewExceptionEnum.NOT_AUTHORIZED,
      );
    }

    await this.prismaService.$transaction(async (transaction) => {
      await Promise.all([
        this.reviewRepository.deleteHelpfulReview(
          selectedHelpfulReview.id,
          transaction,
        ),
        this.reviewRepository.updateHelpfulCount(
          selectedHelpfulReview.reviewId,
          false,
          transaction,
        ),
      ]);
    });
  }
}
