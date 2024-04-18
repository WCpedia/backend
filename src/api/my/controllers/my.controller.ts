import { DOMAIN_NAME } from '@enums/domain-name.enum';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MyService } from '../services/my.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiMy } from './swagger/my.swagger';
import { PaginationDto } from '@api/common/dto/pagination.dto';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { DetailReviewWithPlaceDto } from '../../common/dto/helpful-review.dto';

@ApiTags('My')
@Controller(DOMAIN_NAME.MY)
@UseGuards(AccessTokenGuard)
export class MyController {
  constructor(private readonly myService: MyService) {}

  @ApiMy.GetMyBasicProfile({ summary: '내 프로필 조회' })
  @Get('/basic-profile')
  async getMyBasicProfile(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<BasicUserDto> {
    return this.myService.getMyBasicProfile(authorizedUser.userId);
  }

  @ApiMy.GetMyProfile({ summary: '내 프로필 상세 조회' })
  @Get('/profile')
  async getMyProfile(@GetAuthorizedUser() authorizedUser: IAuthorizedUser) {
    return this.myService.getMyProfile(authorizedUser.userId);
  }

  @ApiMy.GetMyReviews({ summary: '내 리뷰 조회' })
  @Get('/reviews')
  async getMyReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<DetailReviewWithoutHelpfulDto[]> {
    return this.myService.getMyReviews(authorizedUser.userId, paginationDto);
  }

  @ApiMy.GetMyHelpfulReviews({ summary: '내게 도움이 된 리뷰 조회' })
  @Get('/helpful-reviews')
  async getMyHelpfulReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<DetailReviewWithPlaceDto, 'helpfulReviews'>> {
    return this.myService.getMyHelpfulReviews(
      authorizedUser.userId,
      paginationDto,
    );
  }
}
