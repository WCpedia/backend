import { IConvertedDate } from '@api/common/interfaces/interface';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPaginationParams } from '@src/interface/common.interface';

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

  async getFacilityReportListCount(isChecked: boolean) {
    return await this.prismaService.userSubmittedToiletInfo.count({
      where: {
        isChecked,
      },
    });
  }

  async getFacilityReportList(
    paginationParams: IPaginationParams,
    isChecked: boolean,
  ) {
    return await this.prismaService.userSubmittedToiletInfo.findMany({
      take: 10,
      where: {
        isChecked,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: true,
        place: true,
        images: true,
        checker: true,
      },
      ...paginationParams,
    });
  }
}
