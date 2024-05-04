import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByNickname(nickname: string) {
    return this.prismaService.user.findUnique({
      where: { nickname },
    });
  }

  async getUserProfileWithReviews(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async getReviewByUserId(
    targetUserId: number,
    paginationParams: IPaginationParams,
    userId?: number,
  ) {
    return this.prismaService.placeReview.findMany({
      where: { userId: targetUserId },
      include: {
        images: true,
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
        ...(userId && {
          helpfulReviews: {
            where: {
              userId,
            },
          },
        }),
      },
      ...paginationParams,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserTotalReviewCount(userId: number) {
    return this.prismaService.placeReview.count({
      where: { userId },
    });
  }

  async getReadableReviewCount(userId: number, lastItemId: number) {
    return this.prismaService.placeReview.count({
      where: { userId, id: { lt: lastItemId } },
    });
  }
}
