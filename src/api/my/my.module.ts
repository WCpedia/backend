import { CustomConfigModule } from '@core/config/config.module';
import { Module } from '@nestjs/common';
import { MyController } from './controllers/my.controller';
import { MyService } from './services/my.service';
import { MyRepository } from './repository/my.repository';

@Module({
  imports: [CustomConfigModule],
  controllers: [MyController],
  providers: [MyService, MyRepository],
})
export class MyModule {}
