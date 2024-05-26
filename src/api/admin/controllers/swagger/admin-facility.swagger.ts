import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { AdminFacilityController } from '../admin-facility.controller';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { FacilityReportDto } from '../dtos/response/facility-report.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';
import { FacilityReportCountDto } from '../dtos/response/facility-report-count.dto';

export const ApiAdminFacility: ApiOperator<keyof AdminFacilityController> = {
  GetDailyCount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetDailyCount',
        FacilityReportCountDto,
      ),
    );
  },

  GetReportList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetFacilityReportList',
        FacilityReportDto,
      ),
    );
  },
};
