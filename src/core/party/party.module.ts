import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Party } from './domain/models/party.entity';
import { PartyRepositoryImpl } from './infrastructure/repositories/party.repository.impl';
import { CqrsModule } from '@nestjs/cqrs';
import { GetEnterprisesByPartyIdController } from './infrastructure/adapters/controllers/get.controller';
import { GetEnterprisesByPartyIdHandler } from './application/handlers/get-enterprises-by-party.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Party])],
  controllers: [GetEnterprisesByPartyIdController],
  providers: [
    PartyRepositoryImpl,
    { provide: 'IPartyRepository', useClass: PartyRepositoryImpl },
    GetEnterprisesByPartyIdHandler,
  ],
  exports: [{ provide: 'IPartyRepository', useClass: PartyRepositoryImpl }],
})
export class PartyModule {}
