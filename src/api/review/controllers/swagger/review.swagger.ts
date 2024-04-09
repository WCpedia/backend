import { ApiOperator } from '@src/types/type';
import { ReviewController } from '../review.controller';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ReviewWithPlaceDto } from '@api/review/dtos/response/review-with-place.dto';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';

export const ApiReview: ApiOperator<keyof ReviewController> = {
  GetLatestReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetLatestReviews',
        ReviewWithPlaceDto,
        { isArray: true },
      ),
    );
  },
};
