import { PaginationDto } from '@api/common/dto/pagination.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class MyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByUserId(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getHelpfulReviewCount(userId: number) {
    return this.prismaService.helpfulReview.count({
      where: { userId, placeReview: { deletedAt: null } },
    });
  }

  async getMyReviews(userId: number, paginationParams: IPaginationParams) {
    return this.prismaService.placeReview.findMany({
      where: { userId, deletedAt: null },
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
      ...paginationParams,
      orderBy: { createdAt: 'desc' },
    });
  }
}
