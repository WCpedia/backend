import { Review } from '@api/review/review';
import { CustomException } from '@exceptions/http/custom.exception';
import { ReviewImage, VisitTime } from '@prisma/client';
import { setS3BaseUrl } from '@src/utils/s3-url-transformer';

describe('Review', () => {
  let reviewData;
  let s3Url: string = process.env.S3_BUCKET_URL;

  beforeEach(() => {
    setS3BaseUrl(s3Url);
    reviewData = {
      id: 1,
      placeId: 1,
      userId: 1,
      accessibilityRating: 3,
      facilityRating: 3,
      cleanlinessRating: 3,
      visitTime: VisitTime.EVENING,
      description: '좋았습니다',
      helpfulCount: 0,
      images: [],
    };
  });

  describe('리뷰 데이터 업데이트', () => {
    it('리뷰 데이터를 올바르게 업데이트해야 한다', () => {
      const review = new Review(reviewData);
      const newReviewData = {
        accessibilityRating: 4,
        facilityRating: 3,
        cleanlinessRating: 2,
        visitTime: VisitTime.AFTERNOON,
        description: 'Updated description',
      };

      const updatedReview = Review.update(review, newReviewData);

      expect(updatedReview.rating.accessibilityRating).toBe(4);
      expect(updatedReview.rating.facilityRating).toBe(3);
      expect(updatedReview.rating.cleanlinessRating).toBe(2);
      expect(updatedReview.updateData.visitTime).toBe(VisitTime.AFTERNOON);
      expect(updatedReview.updateData.description).toBe('Updated description');
    });
  });

  describe('이미지 업데이트', () => {
    it.each([
      {
        description:
          '새 이미지 파일이 추가되고, 기존 이미지 중 일부가 삭제되는 경우',
        newImageUrls: [`${s3Url}/test/oldKey1`, `${s3Url}/test/oldKey2`],
        newImageFiles: [
          { key: 'test/fileKey1' } as Express.MulterS3.File,
          { key: 'test/fileKey2' } as Express.MulterS3.File,
        ],
        currentImages: [
          { id: 1, key: 'test/oldKey1' },
          { id: 2, key: 'test/oldKey2' },
          { id: 3, key: 'test/oldKey3' },
        ] as ReviewImage[],
        expectedImagesToAdd: ['test/fileKey1', 'test/fileKey2'],
        expectedImagesToDelete: [3],
      },
      {
        description:
          '새 이미지 파일만 추가되고, 모든 기존 이미지가 삭제되는 경우',
        newImageUrls: [],
        newImageFiles: [
          { key: 'test/fileKey1' } as Express.MulterS3.File,
          { key: 'test/fileKey2' } as Express.MulterS3.File,
        ],
        currentImages: [
          { id: 1, key: 'test/oldKey1' },
          { id: 2, key: 'test/oldKey2' },
          { id: 3, key: 'test/oldKey3' },
        ] as ReviewImage[],
        expectedImagesToAdd: ['test/fileKey1', 'test/fileKey2'],
        expectedImagesToDelete: [1, 2, 3],
      },
      {
        description: '새 이미지 파일이 없고, 모든 기존 이미지가 삭제되는 경우',
        newImageUrls: [],
        newImageFiles: [],
        currentImages: [
          { id: 1, key: 'test/oldKey1' },
          { id: 2, key: 'test/oldKey2' },
          { id: 3, key: 'test/oldKey3' },
        ] as ReviewImage[],
        expectedImagesToAdd: [],
        expectedImagesToDelete: [1, 2, 3],
      },
    ])(
      '$description',
      ({
        newImageUrls,
        newImageFiles,
        currentImages,
        expectedImagesToAdd,
        expectedImagesToDelete,
      }) => {
        const { imagesToAdd, imagesToDelete } = Review.updateImages(
          newImageUrls,
          newImageFiles,
          currentImages,
        );

        expect(imagesToAdd).toEqual(expectedImagesToAdd);
        expect(imagesToDelete).toEqual(expectedImagesToDelete);
      },
    );
  });

  describe('작성자 검증', () => {
    it('작성자일때 올바르게 검증해야 한다', () => {
      const review = new Review(reviewData);
      const otherUserId = 2;

      expect(() => review.validateAuthor(otherUserId)).toThrow(CustomException);
      expect(() => review.validateAuthor(review.userId)).not.toThrow();
    });

    it('작성자가 아닐때 올바르게 검증해야 한다', () => {
      const review = new Review(reviewData);
      const otherUserId = 2;

      expect(() => review.validateNotAuthor(review.userId)).toThrow(
        CustomException,
      );
      expect(() => review.validateNotAuthor(otherUserId)).not.toThrow();
    });
  });
});
