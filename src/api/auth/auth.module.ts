import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from './strategies/access-token.startegy';
import { AuthTokenController } from './controllers/auth-token.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthTokenService } from './services/auth-token.service';
import { AuthService } from './services/auth.service';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { CustomConfigModule } from '@core/config/config.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CustomConfigModule, JwtModule.register({})],
  providers: [
    AuthService,
    AuthTokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    AuthRepository,
  ],
  controllers: [AuthController, AuthTokenController],
})
export class AuthModule {}
