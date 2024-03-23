import { Module } from '@nestjs/common';
import { PlaceController } from '@api/place/controllers/place.controller';
import { CustomConfigModule } from '@core/config/config.module';
import { PlaceRepository } from '@api/place/repository/place.repository';
import { PlaceService } from '@api/place/services/place.service';

@Module({
  imports: [CustomConfigModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
})
export class PlaceModule {}
