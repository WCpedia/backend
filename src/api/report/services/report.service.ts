import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';
import { CreateReportDto } from '../dtos/request/create-report.dto';
import Report from '../report';
import { CustomException } from '@exceptions/http/custom.exception';
import { ReportExceptionEnum } from '@exceptions/http/enums/report.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';
import { ReviewRepository } from '@api/review/repository/review.repository';
import { ReviewExceptionEnum } from '@exceptions/http/enums/review.exception.enum';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import PaginationDto from '@api/common/dto/pagination.dto';
import { plainToInstance } from 'class-transformer';
import ReportDto from '../dtos/response/report.dto';
import { PrismaService } from '@core/database/prisma/services/prisma.service';
import { Prisma } from '@prisma/client';
import { BlockRepository } from '@api/block/repository/block.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly blockRepository: BlockRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async createReport(
    userId: number,
    createReportDto: CreateReportDto,
  ): Promise<void> {
    const newReport = Report.create({ reporterId: userId, ...createReportDto });

    await this.checkDuplicateReport(
      newReport.reporterId,
      newReport.targetUserId,
    );
    if (newReport.isReviewReport()) {
      await this.validateTargetReview(newReport);
    }

    await this.trxCreateReport(newReport);
  }

  private async trxCreateReport(newReport: Report) {
    await this.prismaService.$transaction(
      async (transaction: Prisma.TransactionClient) => {
        await this.reportRepository.createReport(
          newReport.createData,
          transaction,
        );
        await this.blockRepository.upsertBlock(
          newReport.reporterId,
          newReport.targetUserId,
          transaction,
        );
      },
    );
  }

  private async checkDuplicateReport(reporterId: number, targetUserId: number) {
    const selectedReport =
      await this.reportRepository.getReportByUserIdAndTargetUserId(
        reporterId,
        targetUserId,
      );
    if (selectedReport && selectedReport.isCreatedToday()) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.DUPLICATE_REPORT_SAME_DAY,
      );
    }
  }

  private async validateTargetReview(report: Report) {
    const selectedReview = await this.reviewRepository.getReview(
      report.targetReviewId,
    );
    if (!selectedReview) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.REVIEW_NOT_EXIST,
      );
    }

    if (selectedReview.userId !== report.targetUserId) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReviewExceptionEnum.MISMATCHED_AUTHOR,
      );
    }
  }

  async getReportList(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<ReportDto[]> {
    const paginationParams = generatePaginationParams(paginationDto);

    const selectedReport = await this.reportRepository.getReportList(
      userId,
      paginationParams,
    );

    return plainToInstance(ReportDto, selectedReport);
  }

  async deleteReport(userId: number, reportId: number): Promise<void> {
    const selectedReport = await this.validateReportExists(reportId);
    selectedReport.validateAuthor(userId);

    if (selectedReport.isDeleted()) {
      return;
    }

    await this.reportRepository.deleteReport(reportId);
  }

  private async validateReportExists(reportId: number) {
    const selectedReport = await this.reportRepository.getReportById(reportId);
    if (!selectedReport) {
      throw new CustomException(
        HttpExceptionStatusCode.BAD_REQUEST,
        ReportExceptionEnum.REPORT_NOT_EXIST,
      );
    }

    return selectedReport;
  }
}
