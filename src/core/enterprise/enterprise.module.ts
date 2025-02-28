import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enterprise } from './domain/models/enterprise.entity';
import { CreateEnterpriseController } from './infrastructure/adapters/controllers/create.controller';
import { UpdateEnterpriseController } from './infrastructure/adapters/controllers/update.controller';
import { DeleteEnterpriseController } from './infrastructure/adapters/controllers/delete.controller';
import { GetEnterpriseController } from './infrastructure/adapters/controllers/get.controller';
import { EnterpriseRepositoryImpl } from './infrastructure/adapters/repositories/enterprise.repository.impl';
import { CreateEnterpriseHandler } from './application/handlers/create-enterprise.handler';
import { UpdateEnterpriseHandler } from './application/handlers/update-enterprise.handler';
import { DeleteEnterpriseHandler } from './application/handlers/delete-enterprise.handler';
import { GetEnterpriseByIdHandler } from './application/handlers/get-enterprise.handler';
import { GetAllEnterprisesHandler } from './application/handlers/get-enterprises.handler';
import { UserModule } from '@core/user/user.module';
import { AddPartyToEnterpriseHandler } from './application/handlers/add-party.handler';
import { PartyModule } from '@core/party/party.module';
import { AddPartyToEnterpriseController } from './infrastructure/adapters/controllers/add-party.controller';
import { UpdatePartyHandler } from './application/handlers/update-party.handler';
import { UpdatePartyController } from './infrastructure/adapters/controllers/update-party.controller';
import { GetEnterprisePartiesHandler } from './application/handlers/get-enterprise-parties.handler';
import { GetEnterprisePartiesController } from './infrastructure/adapters/controllers/get-parties.controller';

@Module({
  imports: [
    UserModule,
    PartyModule,
    CqrsModule,
    TypeOrmModule.forFeature([Enterprise]),
  ],
  controllers: [
    CreateEnterpriseController,
    UpdateEnterpriseController,
    DeleteEnterpriseController,
    GetEnterpriseController,
    AddPartyToEnterpriseController,
    UpdatePartyController,
    GetEnterprisePartiesController,
  ],
  providers: [
    EnterpriseRepositoryImpl,
    { provide: 'IEnterpriseRepository', useClass: EnterpriseRepositoryImpl },
    CreateEnterpriseHandler,
    UpdateEnterpriseHandler,
    DeleteEnterpriseHandler,
    GetEnterpriseByIdHandler,
    GetAllEnterprisesHandler,
    AddPartyToEnterpriseHandler,
    UpdatePartyHandler,
    GetEnterprisePartiesHandler,
  ],
  exports: [
    { provide: 'IEnterpriseRepository', useClass: EnterpriseRepositoryImpl },
  ],
})
export class EnterpriseModule {}
