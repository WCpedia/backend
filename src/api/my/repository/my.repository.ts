import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByUserId(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
}