import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiOperator } from '@src/types/type';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ItemCountDto } from '../dtos/response/daily-item-count.dto';
import { AdminFeedbackController } from '../admin-feedback.controller';

export const ApiAdminFeedback: ApiOperator<keyof AdminFeedbackController> = {
  GetFeedbackCount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'Admin-GetUserCount',
        ItemCountDto,
      ),
    );
  },
};
