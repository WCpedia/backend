import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { NicknameValidator } from '../validators/nickname.validator';
import { ApiUser } from './swagger/user.swagger';
import { AllowGuestGuard } from '@api/common/guards/allow-guest.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { UserExistenceValidationPipe } from '../validators/user-existence-validator';
import { UserWithReviewsDto } from '../dtos/response/user-with-reviews.dto';
import { ApiTags } from '@nestjs/swagger';
import PaginationDto from '@api/common/dto/pagination.dto';
import { ReviewDetailWithPlaceDto } from '@api/common/dto/detail-review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
@ApiTags(DOMAIN_NAME.USER)
@Controller(DOMAIN_NAME.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiUser.CheckNicknameUsable({ summary: '닉네임 사용 가능여부 확인' })
  @Get('/check-nickname')
  async checkNicknameUsable(
    @Query('nickname', NicknameValidator) nickname: string,
  ) {
    return this.userService.checkNicknameUsable(nickname);
  }

  @ApiUser.GetUserProfileWithReviews({ summary: '유저 프로필 조회' })
  @UseGuards(AllowGuestGuard)
  @Get(':userId/detail')
  async getUserProfileWithReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('userId', ParseIntPipe, UserExistenceValidationPipe)
    targetUserId: number,
  ): Promise<UserWithReviewsDto> {
    return this.userService.getUserProfileWithReviews(
      targetUserId,
      authorizedUser?.userId,
    );
  }

  @ApiUser.GetUserReviews({ summary: '유저가 작성한 리뷰 조회' })
  @UseGuards(AllowGuestGuard)
  @Get(':userId/reviews')
  async getUserReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Param('userId', ParseIntPipe, UserExistenceValidationPipe)
    targetUserId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<ReviewDetailWithPlaceDto, 'reviews'>> {
    return this.userService.getUserReviews(
      targetUserId,
      paginationDto,
      authorizedUser?.userId,
    );
  }
}
