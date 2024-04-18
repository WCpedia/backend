import { Injectable } from '@nestjs/common';
import { MyRepository } from '../repository/my.repository';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { plainToInstance } from 'class-transformer';
import { DetailUserProfileDto } from '../repository/response/DetailUserProfile.dts';
import { PaginationDto } from '@api/common/dto/pagination.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { ReviewWithPlaceDto } from '@api/review/dtos/response/review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { ReviewWithDetailsDto } from '@api/common/dto/review-with-details.dto';

@Injectable()
export class MyService {
  constructor(private readonly myRepository: MyRepository) {}

  async getMyBasicProfile(userId: number): Promise<BasicUserDto> {
    const user = await this.myRepository.getUserByUserId(userId);

    return plainToInstance(BasicUserDto, user);
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
  ): Promise<ReviewWithPlaceDto[]> {
    const paginationParams = generatePaginationParams(dto);

    const selectedReviews = await this.myRepository.getMyReviews(
      userId,
      paginationParams,
    );

    return plainToInstance(ReviewWithPlaceDto, selectedReviews);
  }

  async getMyHelpfulReviews(
    userId: number,
    dto: PaginationDto,
  ): Promise<PaginatedResponse<ReviewWithDetailsDto, 'helpfulReviews'>> {
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
      helpfulReviews: plainToInstance(ReviewWithDetailsDto, selectedReviews),
    };
  }
}
