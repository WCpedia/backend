import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

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

  async getReviewByUserId(targetUserId: number, userId?: number) {
    return this.prismaService.placeReview.findMany({
      where: { userId: targetUserId },
      take: 5,
      include: {
        images: true,
        place: true,
        ...(userId && {
          helpfulReviews: {
            where: {
              userId,
            },
          },
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
