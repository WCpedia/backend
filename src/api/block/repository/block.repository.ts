import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
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
      cursor: {
        userId_blockedUserId: {
          userId: userId,
          blockedUserId: cursor.id,
        },
      },
      skip,
      take,
    });
  }
}
