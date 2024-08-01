import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../common/repository/user.repository';
import { UserWithReviewsDto } from '../dtos/response/user-with-reviews.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import PaginationDto from '@api/common/dto/pagination.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { ReviewDetailWithPlaceDto } from '@api/common/dto/detail-review-with-place.dto';
import { PaginatedResponse } from '@api/common/interfaces/interface';

@Injectable()
export class UserService {
  private readonly firstRequestTake: number = 5;
  constructor(private readonly userRepository: UserRepository) {}

  async checkNicknameUsable(nickname: string): Promise<boolean> {
    return !(await this.userRepository.getUserByNickname(nickname));
  }

  async getUserProfileWithReviews(
    targetUserId: number,
    userId?: number,
  ): Promise<UserWithReviewsDto> {
    const userProfile =
      await this.userRepository.getUserProfileWithReviews(targetUserId);

    const paginationParams = generatePaginationParams({
      take: this.firstRequestTake,
    });
    const selectedReviews = await this.userRepository.getReviewByUserId(
      targetUserId,
      paginationParams,
      userId,
    );

    return plainToClass(UserWithReviewsDto, {
      userProfile,
      reviews: selectedReviews,
    });
  }

  async getUserReviews(
    targetUserId: number,
    dto: PaginationDto,
    userId: number,
  ): Promise<PaginatedResponse<ReviewDetailWithPlaceDto, 'reviews'>> {
    const paginationParams = generatePaginationParams(dto);

    const totalItemCount =
      await this.userRepository.getUserTotalReviewCount(targetUserId);
    if (totalItemCount === 0) {
      return { totalItemCount, reviews: [] };
    }

    if (dto.lastItemId) {
      const readableReviewCount =
        await this.userRepository.getReadableReviewCount(
          targetUserId,
          dto.lastItemId,
        );
      if (readableReviewCount === 0) {
        return { totalItemCount, reviews: [] };
      }
    }

    const reviews = await this.userRepository.getReviewByUserId(
      targetUserId,
      paginationParams,
      userId,
    );

    return {
      totalItemCount,
      reviews: plainToInstance(ReviewDetailWithPlaceDto, reviews),
    };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.getUserByUserId(userId);
    if (user.deletedAt) {
      return;
    }

    await this.userRepository.softDeleteUser(userId);
  }
}
