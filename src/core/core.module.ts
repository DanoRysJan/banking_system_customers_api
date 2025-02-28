import { Module } from '@nestjs/common';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { AddressModule } from './address/address.module';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    AuthModule,
    EnterpriseModule,
    AddressModule,
    UserModule,
    CqrsModule,
  ],
})
export class CoreModule {}
