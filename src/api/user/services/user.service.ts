import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserWithReviewsDto } from '../dtos/response/user-with-reviews.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
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

    const selectedReviews = await this.userRepository.getReviewByUserId(
      targetUserId,
      userId,
    );

    return plainToClass(UserWithReviewsDto, {
      userProfile,
      reviews: selectedReviews,
    });
  }
}
