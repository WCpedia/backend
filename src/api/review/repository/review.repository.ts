import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getLatestReviews() {
    return this.prismaService.placeReview.findMany({
      take: 5,
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
}
