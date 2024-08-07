import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { DateUtils } from '@src/utils/date.utils';
import { plainToInstance } from 'class-transformer';
import { ItemCountDto } from '../controllers/dtos/response/daily-item-count.dto';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getUserCount(): Promise<ItemCountDto> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const convertedToday = DateUtils.getUTCStartAndEndOfRange();
    const convertedYesterday = DateUtils.getUTCStartAndEndOfRange(yesterday);

    const [totalItemCount, todayItemCount, yesterdayItemCount] =
      await Promise.all([
        this.adminRepository.countUsers({}),
        this.adminRepository.countUsers(convertedToday),
        this.adminRepository.countUsers(convertedYesterday),
      ]);

    return plainToInstance(ItemCountDto, {
      totalItemCount,
      todayItemCount,
      yesterdayItemCount,
    });
  }
}
