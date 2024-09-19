import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  IKakaoPlaceMenuInfo,
  IKakaoSearchImageDocuments,
  IMenuItem,
  IPlaceUpdateRatingInput,
} from '@api/place/interface/interface';
import { MenuInfo, PlaceReview, Prisma } from '@prisma/client';
import { CreatePlaceReviewDto } from '../dtos/request/create-place-review.dto';
import { IPaginationParams } from '@src/interface/common.interface';
import { ReportFacilityDto } from '../dtos/request/report-facility.dto';
import { OrderByOption } from '@enums/order-by-option.enum';

@Injectable()
export class PlaceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPlaceWithDetailsById(
    id: number,
    userId?: number,
    blockedUserIds: number[] = [],
  ) {
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
        menuInfo: true,
        reviews: {
          take: 5,
          include: {
            user: true,
            images: { where: { deletedAt: null } },
            ...(userId && {
              helpfulReviews: {
                where: {
                  userId,
                },
              },
            }),
          },
          where: {
            NOT: {
              userId: { in: [userId, ...blockedUserIds].filter(Boolean) },
            },
            deletedAt: null,
          },
          orderBy: { createdAt: 'desc' },
        },
        publicToiletInfo: true,
      },
    });
  }

  async createPlaceImages(
    placeId: number,
    placeImages: IKakaoSearchImageDocuments[],
    transaction?: Prisma.TransactionClient,
  ): Promise<Prisma.BatchPayload> {
    return await (transaction ?? this.prismaService).placeImage.createMany({
      data: placeImages.map((placeImage) => ({
        placeId,
        url: placeImage.image_url,
      })),
    });
  }

  async getPlaceImages(
    placeId: number,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).placeImage.findMany({
      where: { placeId },
    });
  }

  async getPlaceReviewByUserId(placeId: number, userId: number) {
    return await this.prismaService.placeReview.findFirst({
      where: { placeId, userId, deletedAt: null },
      include: {
        user: true,
        images: { where: { deletedAt: null } },
      },
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

  async getPlaceReviewWithDetailsByPlaceId(
    placeId: number,
    paginationParams: IPaginationParams,
    userId?: number,
    blockedUserIds: number[] = [],
  ) {
    return await this.prismaService.placeReview.findMany({
      where: {
        placeId,
        NOT: { userId: { in: [userId, ...blockedUserIds].filter(Boolean) } },
        deletedAt: null,
      },
      include: {
        helpfulReviews: {
          where: { userId },
        },
        images: { where: { deletedAt: null } },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      ...paginationParams,
    });
  }

  async getPlaceReviewWithDetailsByUserId(placeId: number, userId: number) {
    return await this.prismaService.placeReview.findFirst({
      where: { placeId, userId, deletedAt: null },
      include: {
        images: { where: { deletedAt: null } },
        user: true,
      },
    });
  }

  async createPlaceMenuInfo(
    placeId: number,
    menuList: IMenuItem[],
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).menuInfo.createMany({
      data: menuList.map((menuItem) => ({
        placeId,
        menu: menuItem.menu,
        price: menuItem.price,
      })),
    });
  }

  async getPlaceMenuInfo(
    placeId: number,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).menuInfo.findMany({
      where: { placeId },
    });
  }

  async updatePlaceIsInitial(
    placeId: number,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).place.update({
      where: { id: placeId },
      data: { isInitial: true },
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
        menuInfo: true,
      },
    });
  }

  async countReview(
    placeId: number,
    blockedUserIds: number[] = [],
  ): Promise<number> {
    return await this.prismaService.placeReview.count({
      where: {
        placeId,
        deletedAt: null,
        NOT: { userId: { in: blockedUserIds } },
      },
    });
  }

  async createPlaceReport(
    placeId: number,
    userId: number,
    dto: ReportFacilityDto,
    reportImages: Express.MulterS3.File[],
  ) {
    const data: Prisma.UserSubmittedToiletInfoUncheckedCreateInput = {
      placeId,
      userId,
      ...dto,
    };
    if (reportImages && reportImages.length > 0) {
      data.images = {
        createMany: {
          data: reportImages.map((reportImage) => ({
            key: reportImage.key,
          })),
        },
      };
    }

    return await this.prismaService.userSubmittedToiletInfo.create({
      data,
    });
  }

  async getUserById(userId: number) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUserRating(
    userId: number,
    userRatingAverage: number,
    transaction?: Prisma.TransactionClient,
  ) {
    return await (transaction ?? this.prismaService).user.update({
      where: { id: userId },
      data: {
        ratingAverage: userRatingAverage,
        totalReviewCount: { increment: 1 },
      },
    });
  }
  async countPlaceWithToilet() {
    return await this.prismaService.place.count({
      where: {
        toiletInfo: {
          some: {},
        },
      },
    });
  }

  async getPlacesWithToilet(paginationParams: IPaginationParams) {
    return await this.prismaService.place.findMany({
      where: {
        toiletInfo: {
          some: {},
        },
      },
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
        toiletInfo: { include: { details: true } },
      },
      orderBy: { id: OrderByOption.DESC },
      ...paginationParams,
    });
  }
}
