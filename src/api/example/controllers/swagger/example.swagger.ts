import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommonResponseDto } from '@dtos/swagger/common-response.dto';
import { UserDto } from '@api/example/dtos/response/user.dto';
import { BasicUserDto } from '@dtos/common/basic-user.dto';
import { StatusResponseDto } from '@dtos/swagger/status-response.dto';
import { PostWithUserDto } from '@api/example/dtos/response/post-with-user.dto';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { ExampleController } from '../example.controller';

export const ApiExample: ApiOperator<keyof ExampleController> = {
  ExampleGetUser: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'ExampleGetUser',
        UserDto,
      ),
    );
  },

  ExampleGetUserList: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'ExampleGetUserList',
        BasicUserDto,
        {
          isArray: true,
        },
      ),
    );
  },

  ExampleCreateUser: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'ExampleCreateUser'),
    );
  },

  ExampleUpdateUser: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'ExampleUpdateUser'),
    );
  },

  ExampleDeleteUser: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'ExampleDeleteUser'),
    );
  },

  ExampleGetPost: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'ExampleGetPost',
        PostWithUserDto,
      ),
    );
  },
};
