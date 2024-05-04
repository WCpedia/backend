import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/services/prisma.service';

@Injectable()
export class ReviewExistenceValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(reviewId: number): Promise<number> {
    const selectedReview = await this.prisma.placeReview.findUnique({
      where: { id: reviewId },
    });
    if (!selectedReview) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        ReviewExceptionEnum.REVIEW_NOT_EXIST,
      );
    }

    return reviewId;
  }
}
