import { Injectable } from '@nestjs/common';
import { MyRepository } from '../repository/my.repository';
import { plainToInstance } from 'class-transformer';
import { DetailUserProfileDto } from '../dtos/response/DetailUserProfile.dts';
import { PaginationDto } from '@api/common/dto/pagination.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { DetailReviewWithoutHelpfulDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { DetailReviewWithPlaceDto } from '../../common/dto/helpful-review.dto';
import { UpdateMyProfileDto } from '../dtos/request/update-my-profile.dto';
import { IUserProfileUpdateInput } from '../interface/interface';
import { transformS3Url } from '@src/utils/s3-url-transformer';
import { UserWithProviderDto } from '@api/common/dto/user-with-provider.dto';

@Injectable()
export class MyService {
  constructor(private readonly myRepository: MyRepository) {}

  async getMyBasicProfile(userId: number): Promise<UserWithProviderDto> {
    const user = await this.myRepository.getUserByUserId(userId);

    return plainToInstance(UserWithProviderDto, user);
  }

  async getMyProfile(userId: number): Promise<DetailUserProfileDto> {
    const user = await this.myRepository.getUserByUserId(userId);
    const helpfulReviewCount =
      await this.myRepository.getHelpfulReviewCount(userId);

    return plainToInstance(DetailUserProfileDto, {
      ...user,
      helpfulReviewCount,
    });
  }

  async getMyReviews(
    userId: number,
    dto: PaginationDto,
  ): Promise<PaginatedResponse<DetailReviewWithoutHelpfulDto, 'myReviews'>> {
    const paginationParams = generatePaginationParams(dto);

    const totalItemCount = await this.myRepository.countMyReviews(userId);

    if (totalItemCount === 0) {
      return { totalItemCount, myReviews: [] };
    }

    const selectedReviews = await this.myRepository.getMyReviews(
      userId,
      paginationParams,
    );

    return {
      totalItemCount,
      myReviews: plainToInstance(
        DetailReviewWithoutHelpfulDto,
        selectedReviews,
      ),
    };
  }

  async getMyHelpfulReviews(
    userId: number,
    dto: PaginationDto,
  ): Promise<PaginatedResponse<DetailReviewWithPlaceDto, 'helpfulReviews'>> {
    const totalItemCount =
      await this.myRepository.getHelpfulReviewCount(userId);

    if (totalItemCount === 0) {
      return { totalItemCount, helpfulReviews: [] };
    }

    const paginationParams = generatePaginationParams(dto);
    const selectedReviews = await this.myRepository.getMyHelpfulReviews(
      userId,
      paginationParams,
    );

    return {
      totalItemCount,
      helpfulReviews: plainToInstance(
        DetailReviewWithPlaceDto,
        selectedReviews,
      ),
    };
  }

  async updateMyProfile(
    userId: number,
    dto: UpdateMyProfileDto,
    newProfileImage?: Express.MulterS3.File,
  ): Promise<string | null> {
    const { profileImage, nickname, description } = dto;
    const profileImageKey = newProfileImage?.key ?? profileImage;
    const data: IUserProfileUpdateInput = {
      profileImageKey,
      nickname: nickname ?? undefined,
      description: description ?? undefined,
    };

    await this.myRepository.updateMyProfile(userId, data);

    return profileImageKey ? transformS3Url({ value: profileImageKey }) : null;
  }
}
