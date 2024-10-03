import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DOMAIN_NAME } from '@src/constants/consts/domain-name.const ';
import { AccessTokenGuard } from '@api/common/guards/access-token.guard';
import { SetRoles } from '@api/common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { RoleGuard } from '@api/common/guards/role.guard';
import { AdminPlaceService } from '@api/admin/services/admin-place.service';
import { UpdateToiletInfoDto } from '@api/admin/controllers/dtos/request/update-toilet-info.dto';
import { ApiAdminPlace } from '@api/admin/controllers/swagger/admin-place.swagger';
import { AdminSearchPlacesDto } from '@api/admin/controllers/dtos/response/admin-search-places.dto';

@ApiTags(DOMAIN_NAME.ADMIN_PLACE)
@Controller(DOMAIN_NAME.ADMIN_PLACE)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminPlaceController {
  constructor(private readonly adminPlaceService: AdminPlaceService) {}

  @ApiAdminPlace.SearchPlaces({ summary: '시설 정보 조회' })
  @Get('/search')
  async searchPlaces(
    @Query('value') value: string,
  ): Promise<AdminSearchPlacesDto[]> {
    return await this.adminPlaceService.searchPlaces(value);
  }

  @ApiAdminPlace.UpdatePlaceToiletInfo({
    summary: '가게 화장실 정보 생성 OR 수정',
  })
  @Patch('/:placeId/facility')
  async updatePlaceToiletInfo(
    @Param('placeId', ParseIntPipe) placeId: number,
    @Body() updateToiletInfoDto: UpdateToiletInfoDto,
  ): Promise<void> {
    return this.adminPlaceService.updatePlaceToiletInfo(
      placeId,
      updateToiletInfoDto,
    );
  }
}
