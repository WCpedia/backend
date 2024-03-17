import { Module } from '@nestjs/common';
import { ExampleService } from './services/example.service';
import { ExampleRepository } from './repository/example.repository';
import { ExampleController } from './controllers/example.controller';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService, ExampleRepository],
})
export class ExampleModule {}
