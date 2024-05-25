import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { AdminFacilityController } from '../admin-facility.controller';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { DailyItemCountDto } from '../dtos/response/daily-item-count.dto';

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
        'GetTotalCount',
        DailyItemCountDto,
      ),
    );
  },
};
