import { ApiOperator } from '@src/types/type';
import { HelpfulReviewController } from '../helpful-review.controller';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';

export const ApiHelpfulReview: ApiOperator<keyof HelpfulReviewController> = {
  DeleteHelpfulReview: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'DeleteHelpfulReview'),
    );
  },
};
