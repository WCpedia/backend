import { ApiOperator } from '@src/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ReportController } from '../report.controller';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';

export const ApiReport: ApiOperator<keyof ReportController> = {
  CreateReport: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'createReport'),
    );
  },
};
