import { Module } from '@nestjs/common';
import { AdminFacilityController } from './controllers/admin-facility.controller';
import { CustomConfigModule } from '@core/config/config.module';
import { AdminFacilityService } from './services/admin-facility.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminPlaceController } from './controllers/admin-place.controller';
import { AdminPlaceService } from './services/admin-place.service';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminUserService } from './services/admin-user.service';
import { AdminReportController } from './controllers/admin-report.controller';
import { AdminReportService } from './services/admin-report.service';
import { AdminFeedbackController } from './controllers/admin-feedback.controller';
import { AdminFeedbackService } from './services/admin-feedback.service';

@Module({
  imports: [CustomConfigModule],
  controllers: [
    AdminFacilityController,
    AdminPlaceController,
    AdminUserController,
    AdminReportController,
    AdminFeedbackController,
  ],
  providers: [
    AdminFacilityService,
    AdminPlaceService,
    AdminRepository,
    AdminUserService,
    AdminReportService,
    AdminFeedbackService,
  ],
})
export class AdminModule {}
