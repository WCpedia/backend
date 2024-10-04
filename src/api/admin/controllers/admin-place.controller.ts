import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';

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

  @ApiAdminPlace.CreatePlaceToiletInfo({
    summary: '가게 화장실 정보 생성 OR 수정',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:placeId/toilet')
  async createPlaceToiletInfo(
    @Param('placeId', ParseIntPipe) placeId: number,
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Body() updateToiletInfoDto: UpdateToiletInfoDto,
  ): Promise<void> {
    return this.adminPlaceService.createPlaceToiletInfo(
      placeId,
      authorizedUser.userId,
      updateToiletInfoDto,
    );
  }
}
