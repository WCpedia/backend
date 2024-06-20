import { ProductConfigService } from '@core/config/services/config.service';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestingModule, Test } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { MyService } from '@api/my/services/my.service';
import { UserRepository } from '@api/common/repository/user.repository';
import { MyRepository } from '@api/my/repository/my.repository';
import { randomInt } from 'crypto';
import User from '@api/user/user';
import UserRepositoryStub from '../stub/user-repository.stub';

describe('ReviewService', () => {
  let myService: MyService;
  let userRepository: UserRepositoryStub;
  let prismaService: PrismaService;
  const s3Url: string = process.env.S3_BUCKET_URL;

  beforeEach(async () => {
    const providers = [
      {
        provide: UserRepository,
        useValue: new UserRepositoryStub(),
      },
      { provide: MyRepository, useValue: mockDeep<MyRepository>() },
      { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      { provide: CACHE_MANAGER, useValue: mockDeep<Cache>() },
      {
        provide: ProductConfigService,
        useValue: mockDeep<ProductConfigService>(),
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [MyService, ...providers],
    }).compile();

    myService = module.get<MyService>(MyService);
    userRepository = module.get<UserRepositoryStub>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    prismaService.$transaction = jest
      .fn()
      .mockImplementation(async (transactionalLogic) => {
        await transactionalLogic(userRepository);
      });
  });

  describe('updateProfile', () => {
    async function updateUserProfile(userId, updateDto, newImages?) {
      const result = await myService.updateMyProfile(
        userId,
        updateDto,
        newImages,
      );
      const updatedUser = await userRepository.findById(userId);
      const expectedProfileImageKey = newImages
        ? newImages.key
        : updateDto.profileImage;
      const expectedProfileImageUrl = expectedProfileImageKey
        ? `${s3Url}/${expectedProfileImageKey}`
        : null;

      return { result, updatedUser, expectedProfileImageUrl };
    }

    describe('updateProfile', () => {
      it('유저1 프로필을 성공적으로 수정한다. 새 이미지X', async () => {
        const user = await userRepository.findById(1);
        const updateDto = {
          nickname: '유저1',
          description: '유저1 소개글',
          profileImage: user.profileImageKey,
        };

        const { result, updatedUser, expectedProfileImageUrl } =
          await updateUserProfile(user.id, updateDto);

        expect(result).toBe(expectedProfileImageUrl);
        expect(updatedUser.profileUpdateData).toEqual({
          nickname: updateDto.nickname,
          description: updateDto.description,
          profileImageKey: updateDto.profileImage,
        });
      });

      it('유저2 프로필을 성공적으로 수정한다. 새 이미지X', async () => {
        const user = await userRepository.findById(2);
        const updateDto = {
          nickname: '유저2',
          description: '유저2 소개글',
          profileImage: user.profileImageKey,
        };
        const { result, updatedUser, expectedProfileImageUrl } =
          await updateUserProfile(user.id, updateDto);

        expect(result).toBe(expectedProfileImageUrl);
        expect(updatedUser.profileUpdateData).toEqual({
          nickname: updateDto.nickname,
          description: updateDto.description,
          profileImageKey: updateDto.profileImage,
        });
      });

      it('유저1 프로필을 성공적으로 수정한다. 새 이미지O', async () => {
        const user = await userRepository.findById(1);
        const updateDto = {
          nickname: '유저1',
          description: '유저1 소개글',
          profileImage: user.profileImageKey,
        };
        const newImages = { key: 'test/newImage1' } as Express.MulterS3.File;

        const { result, updatedUser, expectedProfileImageUrl } =
          await updateUserProfile(user.id, updateDto, newImages);

        expect(result).toBe(expectedProfileImageUrl);
        expect(updatedUser.profileUpdateData).toEqual({
          nickname: updateDto.nickname,
          description: updateDto.description,
          profileImageKey: newImages.key,
        });
      });
    });
  });
});
