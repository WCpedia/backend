import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { MyService } from '../services/my.service';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';
import { ApiTags } from '@nestjs/swagger';
import { ApiMy } from './swagger/my.swagger';
import PaginationDto from '@api/common/dto/pagination.dto';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { DetailReviewWithPlaceDto } from '../../common/dto/helpful-review.dto';
import { UploadImages } from '@src/utils/image-upload-interceptor';
import {
  FilePath,
  UploadFileLimit,
} from '@src/constants/consts/upload-file.const';
import { UpdateMyProfileDto } from '../dtos/request/update-my-profile.dto';
import { DetailUserProfileDto } from '../dtos/response/DetailUserProfile.dts';
import { UserWithProviderDto } from '@api/common/dto/user-with-provider.dto';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { plainToInstance } from 'class-transformer';

@ApiTags(DOMAIN_NAME.MY)
@Controller(DOMAIN_NAME.MY)
@UseGuards(AccessTokenGuard)
export class MyController {
  constructor(private readonly myService: MyService) {}

  @ApiMy.GetMyBasicProfile({ summary: '내 프로필 조회' })
  @Get('/basic-profile')
  async getMyBasicProfile(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<UserWithProviderDto> {
    return await this.myService.getMyBasicProfile(authorizedUser.userId);
  }

  @ApiMy.GetMyProfile({ summary: '내 프로필 상세 조회' })
  @Get('/profile')
  async getMyProfile(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
  ): Promise<DetailUserProfileDto> {
    return this.myService.getMyProfile(authorizedUser.userId);
  }

  @ApiMy.GetMyReviews({ summary: '내 리뷰 조회' })
  @Get('/reviews')
  async getMyReviews(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<DetailReviewWithoutHelpfulDto, 'myReviews'>> {
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

  @ApiMy.UpdateMyProfile({ summary: '내 프로필 수정' })
  @Patch('/profile')
  @UploadImages({
    maxCount: UploadFileLimit.SINGLE,
    path: FilePath.USER,
  })
  async updateMyProfile(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @UploadedFile() profileImage: Express.MulterS3.File,
    @Body() updateMyProfileDto: UpdateMyProfileDto,
  ): Promise<string> {
    return this.myService.updateMyProfile(
      authorizedUser.userId,
      updateMyProfileDto,
      profileImage,
    );
  }
}
