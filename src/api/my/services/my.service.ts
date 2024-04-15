import { Injectable } from '@nestjs/common';
import { MyRepository } from '../repository/my.repository';
import { BasicUserDto } from '@api/common/dto/basic-user.dto';
import { plainToInstance } from 'class-transformer';
import { DetailUserProfileDto } from '../repository/response/DetailUserProfile.dts';

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
}
