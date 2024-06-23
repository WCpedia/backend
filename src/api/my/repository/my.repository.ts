import { PaginationDto } from '@api/common/dto/pagination.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPaginationParams } from '@src/interface/common.interface';
import {
  IUserProfileSnapshotInput,
  IUserProfileUpdateInput,
} from '../interface/interface';
import User from '@api/user/user';

@Injectable()
export class MyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByUserId(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        authentication: true,
      },
    });
  }

  async getHelpfulReviewCount(userId: number) {
    return this.prismaService.helpfulReview.count({
      where: { userId, placeReview: { deletedAt: null, NOT: { userId } } },
    });
  }

  async getMyReviews(userId: number, paginationParams: IPaginationParams) {
    return this.prismaService.placeReview.findMany({
      where: { userId, deletedAt: null },
      include: {
        images: { where: { deletedAt: null } },
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
      ...paginationParams,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyHelpfulReviews(
    userId: number,
    paginationParams: IPaginationParams,
  ) {
    return this.prismaService.placeReview.findMany({
      where: { helpfulReviews: { some: { userId } }, deletedAt: null },
      include: {
        images: { where: { deletedAt: null } },
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
        helpfulReviews: {
          where: { userId },
        },
      },
      ...paginationParams,
    });
  }

  async countMyReviews(userId: number) {
    return this.prismaService.placeReview.count({
      where: { userId, deletedAt: null },
    });
  }
}
