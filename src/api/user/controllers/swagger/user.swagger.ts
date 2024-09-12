import { UserController } from '../user.controller';
import { CommonResponseDto } from '@src/swagger-builder/common-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiOperator } from '@src/types/type';
import { UserWithReviewsDto } from '@api/user/dtos/response/user-with-reviews.dto';
import { TokenConfigDto } from '@src/swagger-builder/auth-config.dto';
import { PaginationResponseDto } from '@src/swagger-builder/pagination-response.dto';
import { ReviewDetailWithPlaceDto } from '@api/common/dto/detail-review-with-place.dto';
import { StatusResponseDto } from '@src/swagger-builder/status-response.dto';

export const ApiUser: ApiOperator<keyof UserController> = {
  CheckNicknameUsable: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'CheckNicknameUsable',
        Boolean,
      ),
    );
  },

  GetUserProfileWithReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'GetUserProfileWithReviews',
        UserWithReviewsDto,
      ),
    );
  },

  GetUserReviews: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'reviews',
        ReviewDetailWithPlaceDto,
      ),
    );
  },

  DeleteUser: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation(apiOperationOptions),
      TokenConfigDto.swaggerBuilder(),
      StatusResponseDto.swaggerBuilder(HttpStatus.OK, 'DeleteUser'),
    );
  },
};
