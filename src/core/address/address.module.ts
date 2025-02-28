import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './domain/models/address.entity';
import { Enterprise } from '../enterprise/domain/models/enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Enterprise])],
  providers: [],
  controllers: [],
})
export class AddressModule {}
