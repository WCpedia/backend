import { Module } from '@nestjs/common';
import { AdminFacilityController } from './controllers/admin-facility.controller';
import { CustomConfigModule } from '@core/config/config.module';
import { AdminFacilityService } from './services/admin-facility.service';
import { AdminRepository } from './repository/admin.repository';

@Module({
  imports: [CustomConfigModule],
  controllers: [AdminFacilityController],
  providers: [AdminFacilityService, AdminRepository],
})
export class AdminModule {}
