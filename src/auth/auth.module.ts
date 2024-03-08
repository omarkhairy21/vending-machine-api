import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.stratgey';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from './jwt.stratgey';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JWTStrategy],
})
export class AuthModule {}
