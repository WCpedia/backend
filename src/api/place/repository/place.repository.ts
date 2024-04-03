import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  IKakaoSearchImageDocuments,
  IPlaceUpdateRatingInput,
} from '@api/place/interface/interface';
import { PlaceReview, Prisma } from '@prisma/client';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';

@Injectable()
export class PlaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPlaceWithDetailsById(id: number) {
    return await this.prismaService.place.findFirst({
      where: { id },
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
        images: true,
      },
    });
  }

  async createPlaceImages(
    placeId: number,
    placeImages: IKakaoSearchImageDocuments[],
  ): Promise<Prisma.BatchPayload> {
    return await this.prismaService.placeImage.createMany({
      data: placeImages.map((placeImage) => ({
        placeId,
        url: placeImage.image_url,
      })),
    });
  }

  async getPlaceImages(placeId: number) {
    return await this.prismaService.placeImage.findMany({
      where: { placeId },
    });
  }

  async getPlaceReviewByUserId(placeId: number, userId: number) {
    return await this.prismaService.placeReview.findUnique({
      where: { placeId_userId: { placeId, userId } },
    });
  }

  async createPlaceReview(
    placeId: number,
    userId: number,
    dto: CreatePlaceReviewDto,
    reviewImages?: Express.MulterS3.File[],
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const reviewData: any = { placeId, userId, ...dto };

    if (reviewImages && reviewImages.length > 0) {
      reviewData.images = {
        createMany: {
          data: reviewImages.map((reviewImage) => ({
            key: reviewImage.key,
          })),
        },
      };
    }

    await (transaction ?? this.prismaService).placeReview.create({
      data: reviewData,
    });
  }

  async getPlaceById(placeId: number) {
    return await this.prismaService.place.findUnique({
      where: { id: placeId },
    });
  }

  async updatePlaceRating(
    placeId: number,
    data: IPlaceUpdateRatingInput,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).place.update({
      where: { id: placeId },
      data,
    });
  }

  async getPlaceReviewWithDetailsByPlaceId(placeId: number, userId?: number) {
    return await this.prismaService.placeReview.findMany({
      where: { placeId, NOT: { userId } },
      include: {
        reviewReactions: {
          where: { userId },
        },
        images: true,
        user: true,
      },
    });
  }

  async getPlaceReviewWithDetailsByUserId(placeId: number, userId: number) {
    return await this.prismaService.placeReview.findUnique({
      where: { placeId_userId: { placeId, userId } },
      include: {
        images: true,
        user: true,
      },
    });
  }
}
