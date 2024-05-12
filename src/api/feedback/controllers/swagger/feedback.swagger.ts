import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { FeedbackController } from '../feedback.controller';
import { ApiOperation } from '@nestjs/swagger';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';

export const ApiFeedback: ApiOperator<keyof FeedbackController> = {
  CreateFeedback: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder('accessToken'),
      StatusResponseDto.swaggerBuilder(HttpStatus.CREATED, 'CreateFeedback'),
    );
  },
};
