import { Controller, Get, Param } from '@nestjs/common';
import { ApiPlace } from '@api/place/controllers/swagger/place.swagger';
import { PlaceService } from '@api/place/services/place.service';
import { PlaceDetailDto } from '@api/place/dtos/response/place-detail.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiPlace.GetPlace({
    summary: '장소 조회',
  })
  @Get(':kakaoId')
  async getPlace(@Param('kakaoId') kakaoId: string): Promise<PlaceDetailDto> {
    return await this.placeService.getPlaceByKakaoId(kakaoId);
  }
}
