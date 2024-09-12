import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { BasicPlaceDto } from '../../common/dto/basic-place.dto';
import { ApiSearch } from './swagger/search.swagger';
import { AllowGuestGuard } from '@api/common/guards/allow-guest.guard';
import { GetAuthorizedUser } from '@api/common/decorators/get-authorized-user.decorator';
import { IAuthorizedUser } from '@api/auth/interface/interface';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiSearch.SearchPlaces({
    summary: '장소 검색',
  })
  @UseGuards(AllowGuestGuard)
  @Get('places')
  async searchPlaces(
    @GetAuthorizedUser() authorizedUser: IAuthorizedUser,
    @Query('value') value: string,
  ): Promise<BasicPlaceDto[]> {
    return await this.searchService.searchPlaces(value, authorizedUser?.userId);
  }
}
