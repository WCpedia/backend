import { IConvertedDate } from '@api/common/interfaces/interface';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getTopReviewers() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.prismaService.placeReview.groupBy({
      //유저 아이디로 그룹바이
      by: ['userId'],
      //작성된 리뷰에서 유저 아이디로 그룹바이한 결과를 카운트 => 작성된 리뷰의 수
      _count: {
        userId: true,
      },
      // 7일 이내에 생성된 리뷰
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
        deletedAt: null,
      },
      // 작성된 리뷰의 수 내림차순 정렬
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 5,
    });
  }

  async getUserProfiles(userIds: number[]) {
    return this.prismaService.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }

  async getLatestReviews() {
    return this.prismaService.placeReview.findMany({
      take: 7,
      where: {
        images: { some: { deletedAt: null } },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
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
    });
  }

  async getDeletedUsers(gteDate: Date, lteDate: Date) {
    return this.prismaService.user.findMany({
      where: {
        deletedAt: {
          gte: gteDate,
          lte: lteDate,
        },
      },
    });
  }

  async deleteUserProfileImageAndAuth(userId: number) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImageKey: null,
        authentication: {
          delete: true,
        },
      },
    });
  }

  async assignPlacesToAreas({
    convertedStartDate,
    convertedEndDate,
  }: IConvertedDate): Promise<void> {
    await this.prismaService.$executeRaw<number[]>`
    INSERT INTO "PlaceToArea" ("placeId", "areaId")
    SELECT p.id, a.id
    FROM "Place" p, "Area" a
    WHERE
      p."createdAt" > ${convertedStartDate}
      AND p."createdAt" < ${convertedEndDate}
      AND p.x BETWEEN a."minX" AND a."maxX"
      AND p.y BETWEEN a."minY" AND a."maxY"
      AND ST_Contains(a.polygon, ST_SetSRID(ST_Point(p.x, p.y), 4326))
    ON CONFLICT ("placeId", "areaId") DO NOTHING
    `;
  }
}
