import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import Report from '../report';
import { Prisma } from '@prisma/client';
import { IPaginationParams } from '@src/interface/common.interface';

@Injectable()
export class ReportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getReportById(reportId: number) {
    const report = await this.prismaService.report.findUnique({
      where: {
        id: reportId,
      },
    });

    return report ? new Report(report) : null;
  }

  async getReportByUserIdAndTargetUserId(userId: number, targetUserId: number) {
    const report = await this.prismaService.report.findFirst({
      where: {
        reporterId: userId,
        targetUserId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return report ? new Report(report) : null;
  }

  async createReport(
    createData: Prisma.ReportUncheckedCreateInput,
    transaction?: Prisma.TransactionClient,
  ) {
    await (transaction ?? this.prismaService).report.create({
      data: createData,
    });
  }

  async getReportList(userId: number, paginationParams: IPaginationParams) {
    return await this.prismaService.report.findMany({
      where: {
        reporterId: userId,
        deletedAt: null,
      },
      include: {
        targetUser: true,
      },
      orderBy: { createdAt: 'desc' },
      ...paginationParams,
    });
  }

  async deleteReport(reportId: number) {
    await this.prismaService.report.update({
      where: {
        id: reportId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
