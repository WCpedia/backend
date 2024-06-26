import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { NicknameNotExistValidator } from './common/validators/nickname-not-exist.validator';
import { SearchModule } from './search/search.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { MyModule } from './my/my.module';
import { ReviewModule } from './review/review.module';
import { TaskModule } from './scheduler/task.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';
import { ReportModule } from './report/report.module';

@Module({
  providers: [NicknameNotExistValidator],
  imports: [
    CoreModule,
    ReportModule,
    AuthModule,
    SearchModule,
    PlaceModule,
    UserModule,
    MyModule,
    ReviewModule,
    TaskModule,
    FeedbackModule,
    AdminModule,
  ],
})
export class ApiModule {}
