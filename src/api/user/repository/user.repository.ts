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
}
