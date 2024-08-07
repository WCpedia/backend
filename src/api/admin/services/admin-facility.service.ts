import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { DateUtils } from '@src/utils/date.utils';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { FacilityReportDto } from '../controllers/dtos/response/facility-report.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { GetFacilityReportListDto } from '../controllers/dtos/request/ge-report-list.dto';
import { FacilityReportStatus } from '../constants/const';
import { FacilityReportCountDto } from '../controllers/dtos/response/facility-report-count.dto';
import { CustomException } from '@exceptions/http/custom.exception';
import { AdminExceptionEnum } from '@exceptions/http/enums/admin.exception.enum';
import { HttpExceptionStatusCode } from '@exceptions/http/enums/http-exception-enum';

@Injectable()
export class AdminFacilityService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getReportCount(): Promise<FacilityReportCountDto> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const convertedToday = DateUtils.getUTCStartAndEndOfRange();
    const convertedYesterday = DateUtils.getUTCStartAndEndOfRange(yesterday);

    const [todayItemCount, yesterdayItemCount, uncheckedReportCount] =
      await Promise.all([
        this.adminRepository.countFacilityReports(convertedToday),
        this.adminRepository.countFacilityReports(convertedYesterday),
        this.adminRepository.countFacilityReports({
          isChecked: FacilityReportStatus.unchecked,
        }),
      ]);

    return plainToInstance(FacilityReportCountDto, {
      uncheckedReportCount,
      todayItemCount,
      yesterdayItemCount,
    });
  }

  async getReportList(
    dto: GetFacilityReportListDto,
  ): Promise<PaginatedResponse<FacilityReportDto, 'reports'>> {
    const { isChecked, ...paginationOptions } = dto;
    const totalItemCount = await this.adminRepository.countFacilityReports({
      isChecked,
    });
    if (totalItemCount === 0) {
      return {
        totalItemCount,
        reports: [],
      };
    }

    const paginationParams = generatePaginationParams(paginationOptions);

    const reports = await this.adminRepository.getFacilityReportList(
      paginationParams,
      isChecked,
    );

    return {
      totalItemCount,
      reports: plainToInstance(FacilityReportDto, reports),
    };
  }

  async updateReportStatus(
    userId: number,
    reportId: number,
    status: boolean,
  ): Promise<void> {
    const selectedReport =
      await this.adminRepository.getFacilityReportById(reportId);
    if (!selectedReport) {
      throw new CustomException(
        HttpExceptionStatusCode.NOT_FOUND,
        AdminExceptionEnum.NOT_FOUND_REPORT,
      );
    }

    await this.adminRepository.updateFacilityReportStatus(
      reportId,
      status,
      userId,
    );
  }
}
