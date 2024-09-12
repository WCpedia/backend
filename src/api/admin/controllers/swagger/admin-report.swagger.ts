import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { AdminReportController } from '../admin-report.controller';
import { ItemCountDto } from '../dtos/response/daily-item-count.dto';

export const ApiAdminReport: ApiOperator<keyof AdminReportController> = {
  GetReportCount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'Admin-GetReportCount',
        ItemCountDto,
      ),
    );
  },
};
