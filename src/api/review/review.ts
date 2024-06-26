import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import {
  PlaceReview,
  PlaceReviewSnapshot,
  ReviewImage,
  VisitTime,
} from '@prisma/client';
import { UploadFileLimit } from '@src/constants/consts/upload-file.const';
import { extractS3Key } from '@src/utils/s3-url-transformer';
import { IPlaceReviewSnapshot, IReviewUpdateData } from './interface/interface';
import { IRatings } from '@src/interface/common.interface';

export class Review {
  private _id: number;
  private _placeId: number;
  private _userId: number;
  private _accessibilityRating: number;
  private _facilityRating: number;
  private _cleanlinessRating: number;
  private _visitTime: VisitTime;
  private _description: string;
  private _helpfulCount: number;
  private _images: ReviewImage[];
  private _snapshot: PlaceReviewSnapshot;

  constructor(
    reviewData: PlaceReview & {
      images?: ReviewImage[];
    },
  ) {
    this._id = reviewData.id;
    this._placeId = reviewData.placeId;
    this._userId = reviewData.userId;
    this._accessibilityRating = reviewData.accessibilityRating;
    this._facilityRating = reviewData.facilityRating;
    this._cleanlinessRating = reviewData.cleanlinessRating;
    this._visitTime = reviewData.visitTime;
    this._description = reviewData.description;
    this._helpfulCount = reviewData.helpfulCount;
    this._images = reviewData.images ?? [];
  }

  static update(oldReview: Review, newReviewData: IReviewUpdateData) {
    oldReview._accessibilityRating = newReviewData.accessibilityRating;
    oldReview._facilityRating = newReviewData.facilityRating;
    oldReview._cleanlinessRating = newReviewData.cleanlinessRating;
    oldReview._visitTime = newReviewData.visitTime ?? oldReview._visitTime;
    oldReview._description =
      newReviewData.description ?? oldReview._description;

    return oldReview;
  }

  static updateImages(
    newImageUrls: string[],
    newImageFiles: Express.MulterS3.File[],
    currentImages: ReviewImage[],
  ): {
    imagesToAdd: string[];
    imagesToDelete: number[];
  } {
    const newImageKeys = this.extractImageKeys(newImageUrls, newImageFiles);
    const currentImageKeys = currentImages.map((image) => image.key);

    const imagesToAdd = newImageKeys.filter(
      (key) => !currentImageKeys.includes(key),
    );

    const imagesToDelete = currentImages
      .filter((image) => !newImageKeys.includes(image.key))
      .map((image) => image.id);

    return { imagesToAdd, imagesToDelete };
  }

  private static extractImageKeys(
    imageUrls: string[],
    imageFiles: Express.MulterS3.File[],
  ): string[] {
    let extractedImageKeys: string[] = [];

    imageUrls.length > 0 &&
      imageUrls.map((url) => extractedImageKeys.push(extractS3Key(url)));
    imageFiles.length > 0 &&
      imageFiles.map((file) => extractedImageKeys.push(file.key));

    //변경된 파일의 수가 REVIEW_IMAGES보다 많은 경우 예외 처리
    if (extractedImageKeys.length > UploadFileLimit.REVIEW_IMAGES) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.REVIEW_IMAGE_LIMIT_EXCEEDED,
      );
    }

    return extractedImageKeys;
  }

  validateAuthor(userId: number) {
    if (this._userId !== userId) {
      throw new CustomException(
        HttpExceptionStatusCode.FORBIDDEN,
        ReviewExceptionEnum.MISMATCHED_AUTHOR,
      );
    }
  }

  validateNotAuthor(userId: number) {
    if (this._userId === userId) {
      throw new CustomException(
        HttpExceptionStatusCode.FORBIDDEN,
        ReviewExceptionEnum.MISMATCHED_AUTHOR,
      );
    }
  }

  get id() {
    return this._id;
  }

  get images() {
    return this._images;
  }

  get placeId() {
    return this._placeId;
  }

  get rating(): IRatings {
    return {
      accessibilityRating: this._accessibilityRating,
      facilityRating: this._facilityRating,
      cleanlinessRating: this._cleanlinessRating,
    };
  }

  get updateData(): IReviewUpdateData {
    return {
      accessibilityRating: this._accessibilityRating,
      facilityRating: this._facilityRating,
      cleanlinessRating: this._cleanlinessRating,
      visitTime: this._visitTime,
      description: this._description,
    };
  }

  get userId() {
    return this._userId;
  }

  get snapshotData(): IPlaceReviewSnapshot {
    return {
      placeId: this._placeId,
      placeReviewId: this._id,
      userId: this._userId,
      accessibilityRating: this._accessibilityRating,
      facilityRating: this._facilityRating,
      cleanlinessRating: this._cleanlinessRating,
      visitTime: this._visitTime,
      description: this._description,
    };
  }

  get allProperties() {
    return {
      id: this._id,
      placeId: this._placeId,
      userId: this._userId,
      accessibilityRating: this._accessibilityRating,
      facilityRating: this._facilityRating,
      cleanlinessRating: this._cleanlinessRating,
      visitTime: this._visitTime,
      description: this._description,
      helpfulCount: this._helpfulCount,
      images: this._images,
    };
  }
}
