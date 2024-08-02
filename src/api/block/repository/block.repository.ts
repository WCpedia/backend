import Report from '@api/report/report';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class BlockRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getBlockedUserIds(userId: number) {
    return this.prismaService.block.findMany({
      where: {
        userId,
      },
      select: {
        blockedUserId: true,
      },
    });
  }

  async countBlocks(userId: number) {
    return this.prismaService.block.count({
      where: {
        userId,
      },
    });
  }

  async getBlockedUserProfiles(
    userId: number,
    { cursor, skip, take }: IPaginationParams,
  ) {
    return this.prismaService.block.findMany({
      where: {
        userId,
      },
      include: {
        blockedUser: true,
      },
      ...(cursor && {
        cursor: {
          userId_blockedUserId: {
            userId,
            blockedUserId: cursor.id,
          },
        },
      }),
      skip,
      take,
    });
  }

  async upsertBlockByReport(
    report: Report,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction || this.prismaService).block.upsert({
      where: {
        userId_blockedUserId: {
          userId: report.reporterId,
          blockedUserId: report.targetUserId,
        },
      },
      create: {
        userId: report.reporterId,
        blockedUserId: report.targetUserId,
      },
      update: {},
    });
  }

  async deleteBlock(userId: number, blockedUserId: number) {
    await this.prismaService.block.delete({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
    });
  }

  async findBlockByUserIdAndBlockedUserId(
    userId: number,
    blockedUserId: number,
  ) {
    return this.prismaService.block.findUnique({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
    });
  }
}
