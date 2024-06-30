import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import Report from '../report';
import { Prisma } from '@prisma/client';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getReportByUserIdAndTargetUserId(userId: number, targetUserId: number) {
    const report = await this.prismaService.report.findFirst({
      where: {
        reporterId: userId,
        targetUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return report ? new Report(report) : null;
  }

  async createReport(createData: Prisma.ReportUncheckedCreateInput) {
    await this.prismaService.report.create({
      data: createData,
    });
  }

  async getReportList(userId: number, paginationParams: IPaginationParams) {
    return await this.prismaService.report.findMany({
      where: {
        reporterId: userId,
      },
      include: {
        targetUser: true,
      },
      orderBy: { createdAt: 'desc' },
      ...paginationParams,
    });
  }
}
