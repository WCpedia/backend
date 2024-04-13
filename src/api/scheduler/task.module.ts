import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { TaskRepository } from './repository/task.repository';
import { CustomConfigModule } from '@core/config/config.module';

@Module({
  imports: [ScheduleModule.forRoot(), CustomConfigModule],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
