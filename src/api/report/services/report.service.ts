import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repository/report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}
}
