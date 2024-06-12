import { IPlaceUpdateRatingInput } from '@api/place/interface/interface';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { CalculateOperation } from '@enums/calculate-operation.enum';
import { CustomException } from '@exceptions/http/custom.exception';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { Injectable } from '@nestjs/common';
import { HelpfulReview, Prisma } from '@prisma/client';
import { Review } from '../review';
import { IComparedReviewImages } from '../interface/interface';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // async getLatestReviews() {
  //   return this.prismaService.placeReview.findMany({
  //     take: 7,
  //     where: { images: { some: { deletedAt: null } }, deletedAt: null },
  //     orderBy: { createdAt: 'desc' },
  //     include: {
  //       images: { where: { deletedAt: null } },
  //       user: true,
  //       place: {
  //         include: {
  //           region: true,
  //           placeCategory: {
  //             include: {
  //               depth1: true,
  //               depth2: true,
  //               depth3: true,
  //               depth4: true,
  //               depth5: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  async getReview(reviewId: number): Promise<Review | null> {
    const reviewData = await this.prismaService.placeReview.findFirst({
      where: { id: reviewId, deletedAt: null },
    });

    return reviewData ? new Review(reviewData) : null;
  }

  async getReviewWithImages(reviewId: number): Promise<Review> {
    const reviewData = await this.prismaService.placeReview.findFirst({
      where: { id: reviewId, deletedAt: null },
      include: {
        images: { where: { deletedAt: null } },
      },
    });
    return new Review(reviewData);
  }

  async getPlace(placeId: number) {
    return this.prismaService.place.findUnique({
      where: { id: placeId },
    });
  }

  async getReviewWithPlace(reviewId: number) {
    return this.prismaService.placeReview.findFirst({
      where: { id: reviewId, deletedAt: null },
      include: {
        place: true,
        images: { where: { deletedAt: null } },
      },
    });
  }

  async countHelpfulReview(reviewId: number, userId: number) {
    return this.prismaService.helpfulReview.count({
      where: { reviewId, userId },
    });
  }

  async createHelpfulReview(
    reviewId: number,
    userId: number,
    transaction?: Prisma.TransactionClient,
  ): Promise<HelpfulReview> {
    return await (transaction ?? this.prismaService).helpfulReview.create({
      data: { reviewId, userId },
    });
  }

  async updateHelpfulCount(
    reviewId: number,
    isIncrement: boolean,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    await (transaction ?? this.prismaService).placeReview.update({
      where: { id: reviewId },
      data: { helpfulCount: isIncrement ? { increment: 1 } : { decrement: 1 } },
    });
  }

  async getHelpfulReview(id: number) {
    return this.prismaService.helpfulReview.findUnique({
      where: { id },
    });
  }

  async deleteHelpfulReview(
    id: number,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).helpfulReview.delete({
      where: { id },
    });
  }

  async getUserById(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUserReview(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).placeReview.update({
      where: { id: review.id },
      data: review.updateData,
    });
  }

  async updatePlaceRating(
    placeId: number,
    updatedRatings: IPlaceUpdateRatingInput,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).place.update({
      where: { id: placeId },
      data: updatedRatings,
    });
  }

  async updateUserRating(
    operation: CalculateOperation,
    userId: number,
    updatedRatings: number,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).user.update({
      where: { id: userId },
      data: {
        ratingAverage: updatedRatings,
        ...(operation === CalculateOperation.DELETE && {
          totalReviewCount: { decrement: 1 },
        }),
      },
    });
  }

  async updateReviewImages(
    reviewId: number,
    updatedReviewImages: IComparedReviewImages,
    transaction?: Prisma.TransactionClient,
  ) {
    if (updatedReviewImages.imagesToDelete.length) {
      const date = new Date();
      await (transaction ?? this.prismaService).reviewImage.updateMany({
        where: { id: { in: updatedReviewImages.imagesToDelete } },
        data: { deletedAt: date },
      });
    }
    if (updatedReviewImages.imagesToAdd.length) {
      await (transaction ?? this.prismaService).reviewImage.createMany({
        data: updatedReviewImages.imagesToAdd.map((url) => ({
          key: url,
          reviewId,
        })),
      });
    }
  }

  async softDeleteReview(
    reviewId: number,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).placeReview.update({
      where: { id: reviewId },
      data: { deletedAt: new Date() },
    });
  }

  async createReviewSnapshot(
    review: Review,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).placeReviewSnapshot.create({
      data: review.snapshotData,
    });
  }
}
