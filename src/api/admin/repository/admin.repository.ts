import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class AdminRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async countFacilityReports({
    isChecked,
    convertedStartDate,
    convertedEndDate,
  }: {
    isChecked?: boolean;
    convertedStartDate?: Date;
    convertedEndDate?: Date;
  }): Promise<number> {
    return await this.prismaService.userSubmittedToiletInfo.count({
      where: {
        ...(isChecked !== undefined && { isChecked }),
        ...(convertedStartDate &&
          convertedEndDate && {
            createdAt: {
              gte: convertedStartDate,
              lt: convertedEndDate,
            },
          }),
      },
    });
  }

  async getFacilityReportList(
    paginationParams: IPaginationParams,
    isChecked: boolean,
  ) {
    return await this.prismaService.userSubmittedToiletInfo.findMany({
      where: {
        isChecked,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: true,
        place: {
          include: {
            publicToiletInfo: true,
          },
        },
        images: true,
        checker: true,
      },
      ...paginationParams,
    });
  }

  async getFacilityReportById(reportId: number) {
    return await this.prismaService.userSubmittedToiletInfo.findUnique({
      where: {
        id: reportId,
      },
    });
  }

  async updateFacilityReportStatus(
    reportId: number,
    status: boolean,
    userId: number,
  ) {
    return await this.prismaService.userSubmittedToiletInfo.update({
      where: {
        id: reportId,
      },
      data: {
        isChecked: status,
        checkedBy: userId,
        checkedAt: new Date(),
      },
    });
  }
}
