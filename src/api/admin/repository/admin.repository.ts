import { IConvertedDate } from '@api/common/interfaces/interface';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async countUserFacilityReport({
    convertedStartDate,
    convertedEndDate,
  }: IConvertedDate) {
    return await this.prismaService.userSubmittedToiletInfo.count({
      where: {
        createdAt: {
          gte: convertedStartDate,
          lt: convertedEndDate,
        },
      },
    });
  }
}
