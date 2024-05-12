import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from '../dtos/request/create-feedback.dto';

@Injectable()
export class FeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async countUserFeedback(userId: number, startOfDay: Date, endOfDay: Date) {
    return await this.prismaService.userFeedback.count({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async createUserFeedback(userId: number, dto: CreateFeedbackDto) {
    await this.prismaService.userFeedback.create({
      data: {
        ...dto,
        userId,
      },
    });
  }
}
