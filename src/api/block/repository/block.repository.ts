import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

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
}
