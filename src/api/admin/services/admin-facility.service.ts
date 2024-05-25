import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { DateUtils } from '@src/utils/date.utils';
import { DailyItemCountDto } from '../controllers/dtos/response/daily-item-count.dto';
import { plainToInstance } from 'class-transformer';

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
}
