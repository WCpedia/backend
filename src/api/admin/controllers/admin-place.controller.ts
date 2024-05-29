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
import { AdminPlaceService } from '../services/admin-place.service';
import { UpdateToiletInfoDto } from './dtos/request/update-toilet-info.dto';
import { ApiAdminPlace } from './swagger/admin-place.swagger';

@ApiTags(DOMAIN_NAME.ADMIN_PLACE)
@Controller(DOMAIN_NAME.ADMIN_PLACE)
@UseGuards(AccessTokenGuard, RoleGuard)
@SetRoles([Role.ADMIN])
export class AdminPlaceController {
  constructor(private readonly adminPlaceService: AdminPlaceService) {}

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
