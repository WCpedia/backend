import { ApiOperator } from '@src/types/type';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ReportController } from '../report.controller';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import ReportDto from '@api/report/dtos/response/report.dto';

export const ApiReport: ApiOperator<keyof ReportController> = {
  GetReportList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'getReportList',
        ReportDto,
      ),
    );
  },

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
