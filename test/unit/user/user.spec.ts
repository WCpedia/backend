import User from '@api/user/user';
import { User as PrismaUser, Role } from '@prisma/client';

describe('User', () => {
  const createUser = (override?: Partial<PrismaUser>) => {
    return new User({
      id: 1,
      role: Role.USER,
      nickname: 'test',
      description: null,
      profileImageKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      totalReviewCount: 0,
      ratingAverage: 0,
      ...override,
    });
  };

  describe('updateProfile', () => {
    it.each([
      {
        description: '닉네임이 업데이트 되어야한다',
        user: createUser({
          nickname: 'kim',
          description: null,
          profileImageKey: null,
        }),
        updateData: {
          nickname: 'park',
          description: null,
          profileImageKey: null,
        },
        expected: {
          nickname: 'park',
          description: null,
          profileImageKey: null,
        },
      },
      {
        description: '유저 소개가 업데이트 되어야한다',
        user: createUser({
          nickname: 'kim',
          description: null,
          profileImageKey: null,
        }),
        updateData: {
          nickname: null,
          description: 'let me introduce myself',
          profileImageKey: null,
        },
        expected: {
          nickname: 'kim',
          description: 'let me introduce myself',
          profileImageKey: null,
        },
      },
      {
        description: '프로필 이미지가 업데이트 되어야한다',
        user: createUser({
          nickname: 'kim',
          description: null,
          profileImageKey: null,
        }),
        updateData: {
          nickname: null,
          description: null,
          profileImageKey: 'asd',
        },
        expected: {
          nickname: 'kim',
          description: null,
          profileImageKey: 'asd',
        },
      },
      {
        description: '닉네임과 유저 소개가 업데이트 되어야한다',
        user: createUser({
          nickname: 'kim',
          description: null,
          profileImageKey: null,
        }),
        updateData: {
          nickname: 'park',
          description: 'let me introduce myself',
          profileImageKey: null,
        },
        expected: {
          nickname: 'park',
          description: 'let me introduce myself',
          profileImageKey: null,
        },
      },
    ])('$description', ({ user, updateData, expected }) => {
      user.updateProfile(updateData);

      expect(user.profileUpdateData).toEqual(expected);
    });
  });
});
