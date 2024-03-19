import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('places')
  async searchPlaces(@Query('value') value: string) {
    await this.searchService.searchPlaces(value);
  }
}
