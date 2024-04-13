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
  // async findTopReviewers() {
  //   // 현재 날짜
  //   const now = new Date();
  //   // 현재 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  //   const dayOfWeek = now.getDay();

  //   // 이번 주 월요일 날짜 계산
  //   const mondayThisWeek = new Date(now);
  //   mondayThisWeek.setDate(
  //     now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1),
  //   );

  //   // 이번 주 일요일 날짜 계산
  //   const sundayThisWeek = new Date(mondayThisWeek);
  //   sundayThisWeek.setDate(mondayThisWeek.getDate() + 6);

  //   // 월요일 0시 0분 0초
  //   mondayThisWeek.setHours(0, 0, 0, 0);
  //   // 일요일 23시 59분 59초
  //   sundayThisWeek.setHours(23, 59, 59, 999);

  //   return this.prismaService.placeReview.groupBy({
  //     by: ['userId'],
  //     _count: {
  //       userId: true,
  //     },
  //     where: {
  //       createdAt: {
  //         gte: mondayThisWeek,
  //         lte: sundayThisWeek,
  //       },
  //     },
  //     orderBy: {
  //       _count: {
  //         userId: 'desc',
  //       },
  //     },
  //     take: 5,
  //   });
  // }
}
