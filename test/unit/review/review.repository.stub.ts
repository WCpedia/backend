import { IPlaceUpdateRatingInput } from '@api/place/interface/interface';
import {
  IComparedReviewImages,
  IReviewUpdateData,
} from '@api/review/interface/interface';
import { ReviewRepository } from '@api/review/repository/review.repository';
import { Review } from '@api/review/review';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import {
  Place,
  PlaceReview,
  ReviewImage,
  Prisma,
  HelpfulReview,
  User,
  Role,
  VisitTime,
} from '@prisma/client';

export default class ReviewRepositoryStub {
  private _review: Review;
  constructor() {
    this._review = new Review({
      id: 1,
      placeId: 1,
      userId: 1,
      accessibilityRating: 4,
      facilityRating: 4,
      cleanlinessRating: 4,
      visitTime: VisitTime.EVENING,
      description: '좋았습니다',
      helpfulCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      images: [],
    });
  }

  getReview(reviewId: number): Promise<Review> {
    return reviewId === this._review.id
      ? Promise.resolve(this._review)
      : Promise.resolve(null);
  }
  getReviewWithImages(reviewId: number): Promise<Review> {
    return reviewId === this._review.id
      ? Promise.resolve(this._review)
      : Promise.resolve(null);
  }

  getPlace(placeId: number): Promise<Place> {
    return Promise.resolve({
      id: placeId,
      kakaoId: '123',
      name: 'test',
      placeCategoryId: 1,
      regionId: 1,
      detailAddress: 'test',
      telephone: '01012345678',
      facilityRating: 5,
      accessibilityRating: 5,
      cleanlinessRating: 5,
      reviewCount: 4,
      kakaoUrl: 'test',
      x: 1,
      y: 1,
      isInitial: true,
    });
  }

  getUserById(userId: number): Promise<User> {
    return Promise.resolve({
      id: userId,
      role: Role.USER,
      nickname: 'test',
      description: null,
      profileImageKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      totalReviewCount: 0,
      ratingAverage: 0,
    });
  }

  getReviewWithPlace(
    reviewId: number,
  ): Promise<PlaceReview & { place: Place; images: ReviewImage[] }> {
    return;
  }

  countHelpfulReview(reviewId: number, userId: number): Promise<number> {
    return;
  }

  createHelpfulReview(
    reviewId: number,
    userId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<HelpfulReview> {
    return;
  }

  updateHelpfulCount(
    reviewId: number,
    isIncrement: boolean,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  getHelpfulReview(id: number): Promise<HelpfulReview> {
    return;
  }

  deleteHelpfulReview(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  updateUserReview(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  updatePlaceRating(
    placeId: number,
    updatedRatings: IPlaceUpdateRatingInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  updateUserRating(
    operation: CalculateOperation,
    userId: number,
    updatedRatings: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  updateReviewImages(
    reviewId: number,
    updatedReviewImages: IComparedReviewImages,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  softDeleteReview(
    reviewId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  createReviewSnapshot(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }
}
