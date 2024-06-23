import User from '@api/user/user';
import { UserRepository } from '@api/common/repository/user.repository';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import {
  Prisma,
  PlaceReview,
  ReviewImage,
  Place,
  User as PrismaUser,
  Role,
  VisitTime,
} from '@prisma/client';
import { IPaginationParams } from '@src/interface/common.interface';

type PartialUserRepository = Partial<UserRepository>;

export default class UserRepositoryStub implements PartialUserRepository {
  private _users: Map<number, User>;

  constructor() {
    this._users = new Map<number, User>(); // 초기화 누락 수정
    // 유저 2명을 미리 추가
    const user1 = new User({
      id: 1,
      nickname: 'user1',
      description: 'First user',
      profileImageKey: 'test/user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user2 = new User({
      id: 2,
      nickname: 'user2',
      description: 'Second user',
      profileImageKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this._users.set(user1.id, user1);
    this._users.set(user2.id, user2);
  }

  async createTestUser(user: User) {
    return this._users.set(user.id, user);
  }

  async updateProfile(
    user: User,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const existingUser = this._users.get(user.id);
    if (existingUser) {
      existingUser.updateProfile(user.profileUpdateData);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    return this._users.get(id);
  }

  async createProfileSnapshot(user: User): Promise<void> {}

  async getUserByNickname(nickname: string): Promise<PrismaUser | null> {
    return null;
  }

  async getUserProfileWithReviews(userId: number): Promise<PrismaUser | null> {
    return null;
  }

  async getUserTotalReviewCount(userId: number): Promise<number> {
    return 0;
  }

  async getReadableReviewCount(
    userId: number,
    lastItemId: number,
  ): Promise<number> {
    return 0;
  }
}
