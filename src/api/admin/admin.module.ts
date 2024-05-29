import { Module } from '@nestjs/common';
import { AdminFacilityController } from './controllers/admin-facility.controller';
import { CustomConfigModule } from '@core/config/config.module';
import { AdminFacilityService } from './services/admin-facility.service';
import { AdminRepository } from './repository/admin.repository';
import { AdminPlaceController } from './controllers/admin-place.controller';
import { AdminPlaceService } from './services/admin-place.service';

@Module({
  imports: [CustomConfigModule],
  controllers: [AdminFacilityController, AdminPlaceController],
  providers: [AdminFacilityService, AdminPlaceService, AdminRepository],
})
export class AdminModule {}
