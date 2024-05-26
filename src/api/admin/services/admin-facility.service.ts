import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { DateUtils } from '@src/utils/date.utils';
import { DailyItemCountDto } from '../controllers/dtos/response/daily-item-count.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponse } from '@api/common/interfaces/interface';
import { FacilityReportDto } from '../controllers/dtos/response/facility-report.dto';
import { PaginationDto } from '@api/common/dto/pagination.dto';
import { generatePaginationParams } from '@src/utils/pagination-params-generator';
import { GetFacilityReportListDto } from '../controllers/dtos/request/ge-report-list.dto';

@Injectable()
export class AdminFacilityService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getFacilityReportCount(): Promise<DailyItemCountDto> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const convertedToday = DateUtils.getUTCStartAndEndOfRange();
    const convertedYesterday = DateUtils.getUTCStartAndEndOfRange(yesterday);

    const todayItemCount =
      await this.adminRepository.countUserFacilityReport(convertedToday);
    const yesterdayItemCount =
      await this.adminRepository.countUserFacilityReport(convertedYesterday);

    return plainToInstance(DailyItemCountDto, {
      todayItemCount,
      yesterdayItemCount,
    });
  }

  async getReportList(
    dto: GetFacilityReportListDto,
  ): Promise<PaginatedResponse<FacilityReportDto, 'reports'>> {
    const { isChecked, ...paginationOptions } = dto;
    const totalItemCount =
      await this.adminRepository.getFacilityReportListCount(isChecked);
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
}
