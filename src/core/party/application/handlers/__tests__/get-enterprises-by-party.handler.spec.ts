import { Test, TestingModule } from '@nestjs/testing';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { Paginated } from '../../../../common/domain/interfaces/pagination.interface';
import { GetEnterprisesByPartyIdHandler } from '../get-enterprises-by-party.handler';
import { IPartyRepository } from '../../../../party/domain/ports/repositories/party.repository';
import { GetEnterprisesByPartyIdQuery } from '../../queries/get-enterprises-by-party.query';

describe('GetEnterprisesByPartyIdHandler', () => {
  let handler: GetEnterprisesByPartyIdHandler;
  let partyRepository: IPartyRepository;

  beforeEach(async () => {
    const mockPartyRepository = {
      getEnterprisesByPartyId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetEnterprisesByPartyIdHandler,
        { provide: 'IPartyRepository', useValue: mockPartyRepository },
      ],
    }).compile();

    handler = module.get<GetEnterprisesByPartyIdHandler>(
      GetEnterprisesByPartyIdHandler,
    );
    partyRepository = module.get<IPartyRepository>('IPartyRepository');
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return paginated enterprises for a given party ID', async () => {
    const enterprises: Enterprise[] = [new Enterprise(), new Enterprise()];
    const paginatedEnterprises: Paginated<Enterprise> = {
      data: enterprises,
      count: 2,
      page: 1,
      limit: 10,
    };

    jest
      .spyOn(partyRepository, 'getEnterprisesByPartyId')
      .mockResolvedValue(paginatedEnterprises);

    const query = new GetEnterprisesByPartyIdQuery('party-id', 1, 10);
    const result = await handler.execute(query);

    expect(result).toEqual(paginatedEnterprises);
    expect(partyRepository.getEnterprisesByPartyId).toHaveBeenCalledWith(
      'party-id',
      1,
      10,
    );
  });
});
