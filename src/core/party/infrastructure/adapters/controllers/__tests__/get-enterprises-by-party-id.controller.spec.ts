import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { GetEnterprisesByPartyIdQuery } from '../../../../../party/application/queries/get-enterprises-by-party.query';
import { Enterprise } from '../../../../../enterprise/domain/models/enterprise.entity';
import { Paginated } from '../../../../../common/domain/interfaces/pagination.interface';
import { GetEnterprisesByPartyIdController } from '../get.controller';

describe('GetEnterprisesByPartyIdController', () => {
  let controller: GetEnterprisesByPartyIdController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const mockQueryBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetEnterprisesByPartyIdController],
      providers: [{ provide: QueryBus, useValue: mockQueryBus }],
    }).compile();

    controller = module.get<GetEnterprisesByPartyIdController>(
      GetEnterprisesByPartyIdController,
    );
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call QueryBus with GetEnterprisesByPartyIdQuery and return paginated enterprises', async () => {
    const enterprises: Enterprise[] = [new Enterprise(), new Enterprise()];
    const paginatedEnterprises: Paginated<Enterprise> = {
      data: enterprises,
      count: 2,
      page: 1,
      limit: 10,
    };

    jest.spyOn(queryBus, 'execute').mockResolvedValue(paginatedEnterprises);

    const result = await controller.getEnterprisesByPartyId('party-id', 1, 10);

    expect(result).toEqual(paginatedEnterprises);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetEnterprisesByPartyIdQuery('party-id', 1, 10),
    );
  });
});
