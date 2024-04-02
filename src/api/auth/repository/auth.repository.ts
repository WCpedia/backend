import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Authentication, Prisma, User } from '@prisma/client';

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

  async createUser(
    userInputDate: Prisma.UserCreateInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<User> {
    return await (transaction ?? this.prismaService).user.create({
      data: userInputDate,
    });
  }

  async createAuthentication(
    authInputData: Prisma.AuthenticationUncheckedCreateInput,
    transaction?: Prisma.TransactionClient,
  ): Promise<void> {
    await (transaction ?? this.prismaService).authentication.create({
      data: authInputData,
    });
  }
}
