import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Authentication, Prisma, Provider, User } from '@prisma/client';
import { IOauthPayload } from '../interface/interface';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserWithAuthByOAuthId({
    providerUserId,
    provider,
  }: {
    providerUserId: string;
    provider: Provider;
  }): Promise<
    User & {
      authentication: Authentication;
    }
  > {
    return await this.prismaService.user.findFirst({
      where: {
        authentication: {
          providerUserId,
          provider,
        },
      },
      include: {
        authentication: true,
      },
    });
  }

  async getUserWithAuthByEmail(email: string): Promise<
    User & {
      authentication: Authentication;
    }
  > {
    return await this.prismaService.user.findFirst({
      where: {
        authentication: { email },
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
