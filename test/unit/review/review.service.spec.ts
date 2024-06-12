import { UpdatePlaceReviewDto } from '@api/review/dtos/request/update-place-review.dto';
import { ReviewRepository } from '@api/review/repository/review.repository';
import { ReviewService } from '@api/review/services/review.service';
import { AwsS3Service } from '@core/aws/s3/services/aws-s3.service';
import { ProductConfigService } from '@core/config/services/config.service';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TestingModule, Test } from '@nestjs/testing';
import { VisitTime } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import ReviewRepositoryStub from './review.repository.stub';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: ReviewRepositoryStub;
  let prismaService: PrismaService;
  let cacheManager: Cache;
  let configService: ProductConfigService;
  let awsS3Service: AwsS3Service;
  let updateDto: UpdatePlaceReviewDto;
  let newImages: Express.MulterS3.File[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: ReviewRepository, useClass: ReviewRepositoryStub },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        { provide: CACHE_MANAGER, useValue: mockDeep<Cache>() },
        {
          provide: ProductConfigService,
          useValue: mockDeep<ProductConfigService>(),
        },
        { provide: AwsS3Service, useValue: mockDeep<AwsS3Service>() },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    reviewRepository = module.get<ReviewRepositoryStub>(ReviewRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    configService = module.get<ProductConfigService>(ProductConfigService);
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);

    updateDto = {
      description: '리뷰를 수정합니다.',
      accessibilityRating: 3,
      facilityRating: 3,
      cleanlinessRating: 3,
      visitTime: VisitTime.AFTERNOON,
      imageUrls: [],
    };
    newImages = [];
  });

  describe('updateReview', () => {
    it('작성자는 리뷰를 수정할 수 있다.', async () => {
      const userId = 1;
      const reviewId = 1;

      await service.updateReview(userId, reviewId, updateDto, newImages);

      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('존재하지 않는 리뷰를 수정하려고 하면 오류가 발생한다.', async () => {
      const userId = 1;
      const reviewId = 2;
      const error = new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        ReviewExceptionEnum.REVIEW_NOT_EXIST,
      );

      await expectUpdateReviewToThrow(userId, reviewId, error);
    });

    it('작성자가 아닌 사용자가 리뷰를 수정하려고 하면 오류가 발생한다.', async () => {
      const userId = 2;
      const reviewId = 1;
      const error = new CustomException(
        HttpExceptionStatusCode.FORBIDDEN,
        ReviewExceptionEnum.MISMATCHED_AUTHOR,
      );

      await expectUpdateReviewToThrow(userId, reviewId, error);
    });

    it('추가된 이미지의 개수가 지정한 개수를 초과하면 오류가 발생한다.', async () => {
      const userId = 1;
      const reviewId = 1;
      newImages = [
        { key: 'test/fileKey1' } as Express.MulterS3.File,
        { key: 'test/fileKey2' } as Express.MulterS3.File,
        { key: 'test/fileKey3' } as Express.MulterS3.File,
        { key: 'test/fileKey4' } as Express.MulterS3.File,
        { key: 'test/fileKey5' } as Express.MulterS3.File,
        { key: 'test/fileKey6' } as Express.MulterS3.File,
      ];

      const error = new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.REVIEW_IMAGE_LIMIT_EXCEEDED,
      );

      await expectUpdateReviewToThrow(userId, reviewId, error, newImages);
    });

    async function expectUpdateReviewToThrow(
      userId: number,
      reviewId: number,
      error: CustomException,
      newImages: Express.MulterS3.File[] = [],
    ) {
      await expect(
        service.updateReview(userId, reviewId, updateDto, newImages),
      ).rejects.toThrow(error);
    }
  });
});
