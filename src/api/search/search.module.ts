import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { SearchRepository } from './repository/search.repository';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
})
export class SearchModule {}
