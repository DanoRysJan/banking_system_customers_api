import { Module } from '@nestjs/common';
import { RoleRepositoryImpl } from './infrastructure/repositories/role.repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './domain/models/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [
    RoleRepositoryImpl,
    { provide: 'IRoleRepository', useClass: RoleRepositoryImpl },
  ],
  exports: [{ provide: 'IRoleRepository', useClass: RoleRepositoryImpl }],
})
export class RoleModule {}
