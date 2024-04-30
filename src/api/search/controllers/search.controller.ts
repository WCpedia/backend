import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';
import { plainToInstance } from 'class-transformer';
import { BasicPlaceDto } from '../../common/dto/basic-place.dto';
import { ApiSearch } from './swagger/search.swagger';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiSearch.SearchPlaces({
    summary: '장소 검색',
  })
  @Get('places')
  async searchPlaces(@Query('value') value: string): Promise<any> {
    return await this.searchService.searchPlaces(value);
  }
}
