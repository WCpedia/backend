import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';
import { SearchRepository } from './repository/search.repository';
import { CustomConfigModule } from '@core/config/config.module';

@Module({
  imports: [CustomConfigModule],
  controllers: [SearchController],
  providers: [SearchService, SearchRepository],
})
export class SearchModule {}
