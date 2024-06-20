import { CustomConfigModule } from '@core/config/config.module';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { CommonRepositoryModule } from '@api/common/repository/common-repository.module';

@Module({
  imports: [CustomConfigModule, CommonRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
