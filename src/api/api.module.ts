import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { AuthModule } from './auth/auth.module';
import { NicknameNotExistValidator } from './common/validators/nickname-not-exist.validator';
import { SearchModule } from './search/search.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { MyModule } from './my/my.module';

@Module({
  providers: [NicknameNotExistValidator],
  imports: [
    CoreModule,
    AuthModule,
    SearchModule,
    PlaceModule,
    UserModule,
    MyModule,
  ],
})
export class ApiModule {}
