import { Injectable } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { DateUtils } from '@src/utils/date.utils';
import { plainToInstance } from 'class-transformer';
import { ItemCountDto } from '../controllers/dtos/response/daily-item-count.dto';

@Injectable()
export class AdminFeedbackService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async getFeedbackCount(): Promise<ItemCountDto> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const convertedToday = DateUtils.getUTCStartAndEndOfRange();
    const convertedYesterday = DateUtils.getUTCStartAndEndOfRange(yesterday);

    const [totalItemCount, todayItemCount, yesterdayItemCount] =
      await Promise.all([
        this.adminRepository.countFeedback({}),
        this.adminRepository.countFeedback(convertedToday),
        this.adminRepository.countFeedback(convertedYesterday),
      ]);

    return plainToInstance(ItemCountDto, {
      totalItemCount,
      todayItemCount,
      yesterdayItemCount,
    });
  }
}
