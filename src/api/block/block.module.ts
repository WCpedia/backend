import { CommonRepositoryModule } from '@api/common/repository/common-repository.module';
import { BlockService } from './services/block.service';
import { Module } from '@nestjs/common';
import { BlockController } from './controllers/block.controller';
import { BlockRepository } from './repository/block.repository';

@Module({
  imports: [CommonRepositoryModule],
  controllers: [BlockController],
  providers: [BlockService, BlockRepository],
  exports: [BlockRepository],
})
export class BlockModule {}
