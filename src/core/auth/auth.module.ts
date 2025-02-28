import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './infrastructure/adapters/controllers/auth.controller';
import { LoginUserHandler } from './application/handlers/login-user.handler';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { AuthService } from './domain/services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterUserHandler } from './application/handlers/register-user.handler';
import { RolesGuard } from './application/guards/roles.guard';

@Module({
  imports: [
    UserModule,
    RoleModule,
    PassportModule,
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RolesGuard,
    LoginUserHandler,
    RegisterUserHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
