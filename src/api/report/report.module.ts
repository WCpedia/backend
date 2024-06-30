import { Module, forwardRef } from '@nestjs/common';
import { ReportService } from './services/report.service';
import { ReportController } from './controllers/report.controller';
import { ReportRepository } from './repository/report.repository';
import { ReviewModule } from '@api/review/review.module';

@Module({
  imports: [forwardRef(() => ReviewModule)],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
})
export class ReportModule {}
