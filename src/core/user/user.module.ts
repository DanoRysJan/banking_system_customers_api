import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './domain/models/user.entity';
import { UserController } from './infrastructure/adapters/controllers/get.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { GetUserHandler } from './application/handlers/get-user.handler';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UserController],
  providers: [
    UserRepositoryImpl,
    { provide: 'IUserRepository', useClass: UserRepositoryImpl },
    GetUserHandler,
  ],
  exports: [
    UserRepositoryImpl,
    { provide: 'IUserRepository', useClass: UserRepositoryImpl },
  ],
})
export class UserModule {}
