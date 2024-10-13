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

type PartialReviewRepository = Partial<ReviewRepository>;

export default class ReviewRepositoryStub implements PartialReviewRepository {
  private _review: Review;
  constructor(images?: ReviewImage[], date: Date = new Date()) {
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
      createdAt: date,
      updatedAt: date,
      deletedAt: null,
      images: images ?? [
        {
          id: 1,
          reviewId: 1,
          key: 'test/fileKey1',
          createdAt: new Date(),
          deletedAt: null,
        },
      ],
    });
  }

  setImages(images: ReviewImage[], date: Date = new Date()) {
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
      createdAt: date,
      updatedAt: date,
      deletedAt: null,
      images,
    });
  }

  async getReview(reviewId: number): Promise<Review> {
    return reviewId === this._review.id
      ? Promise.resolve(this._review)
      : Promise.resolve(null);
  }
  async getReviewWithImages(reviewId: number): Promise<Review> {
    return reviewId === this._review.id
      ? Promise.resolve(this._review)
      : Promise.resolve(null);
  }

  async getPlace(
    placeId: number,
    createdAt: Date = new Date(),
  ): Promise<Place> {
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
      createdAt,
    });
  }

  async getUserById(userId: number): Promise<User> {
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
      isBanned: false,
    });
  }

  async getReviewWithPlace(
    reviewId: number,
  ): Promise<PlaceReview & { place: Place; images: ReviewImage[] }> {
    return;
  }

  async countHelpfulReview(reviewId: number, userId: number): Promise<number> {
    return;
  }

  async createHelpfulReview(
    reviewId: number,
    userId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<HelpfulReview> {
    return;
  }

  async updateHelpfulCount(
    reviewId: number,
    isIncrement: boolean,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async getHelpfulReview(id: number): Promise<HelpfulReview> {
    return;
  }

  async deleteHelpfulReview(
    id: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async updateUserReview(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    this._review = review;
    return;
  }

  async updatePlaceRating(
    placeId: number,
    updatedRatings: IPlaceUpdateRatingInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async updateUserRating(
    operation: CalculateOperation,
    userId: number,
    updatedRatings: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async createReviewImages(
    reviewId: number,
    imagesToAdd: string[],
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async softDeleteReviewImages(
    imagesToDelete: number[],
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async softDeleteReview(
    reviewId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }

  async createReviewSnapshot(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    return;
  }
}
