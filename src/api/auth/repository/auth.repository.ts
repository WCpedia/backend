import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Authentication, Provider, User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserWithAuth(email: string): Promise<
    User & {
      authentication: Authentication;
    }
  > {
    return await this.prismaService.user.findFirst({
      where: {
        authentication: { email, deletedAt: null },
      },
      include: {
        authentication: true,
      },
    });
  }
}
