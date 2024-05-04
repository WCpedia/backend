import { IPlaceUpdateRatingInput } from '@api/place/interface/interface';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { HelpfulReview, Prisma } from '@prisma/client';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getLatestReviews() {
    return this.prismaService.placeReview.findMany({
      take: 7,
      where: { images: { some: { id: { not: undefined } } } },
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        user: true,
        place: {
          include: {
            region: true,
            placeCategory: {
              include: {
                depth1: true,
                depth2: true,
                depth3: true,
                depth4: true,
                depth5: true,
              },
            },
          },
        },
      },
    });
  }

  async getReview(reviewId: number) {
    return this.prismaService.placeReview.findFirst({
      where: { id: reviewId, deletedAt: null },
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

  async getUser(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUserReview(
    reviewId: number,
    updatedRatings: Prisma.PlaceReviewUpdateInput,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).placeReview.update({
      where: { id: reviewId },
      data: updatedRatings,
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
    userId: number,
    updatedRatings: number,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).user.update({
      where: { id: userId },
      data: { ratingAverage: updatedRatings },
    });
  }

  async updateReviewImages(
    reviewId: number,
    imagesToAdd: string[],
    imagesToDelete: number[],
    transaction?: Prisma.TransactionClient,
  ) {
    if (imagesToDelete.length) {
      const date = new Date();
      await (transaction ?? this.prismaService).reviewImage.updateMany({
        where: { id: { in: imagesToDelete } },
        data: { deletedAt: date },
      });
    }
    if (imagesToAdd.length) {
      await (transaction ?? this.prismaService).reviewImage.createMany({
        data: imagesToAdd.map((url) => ({ key: url, reviewId })),
      });
    }
  }
}
