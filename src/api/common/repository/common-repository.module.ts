import { Module } from '@nestjs/common';
import { UserRepository } from '@api/common/repository/user.repository';
import { PrismaModule } from '@core/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class CommonRepositoryModule {}
