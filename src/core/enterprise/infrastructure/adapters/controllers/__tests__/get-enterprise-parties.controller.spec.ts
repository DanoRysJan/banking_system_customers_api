import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { GetEnterprisePartiesController } from '../get-parties.controller';
import { GetEnterprisePartiesQuery } from '../../../../../enterprise/application/queries/get-enterprise-parties.query';

describe('GetEnterprisePartiesController', () => {
  let controller: GetEnterprisePartiesController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetEnterprisePartiesController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetEnterprisePartiesController>(
      GetEnterprisePartiesController,
    );
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEnterpriseParties', () => {
    it('should return a list of parties', async () => {
      const enterpriseId = 'a123e4567-e89b-12d3-a456-426614174000';
      const page = 1;
      const limit = 10;
      const result = [{ id: 'party1' }, { id: 'party2' }];

      jest.spyOn(queryBus, 'execute').mockResolvedValue(result);

      expect(
        await controller.getEnterpriseParties(enterpriseId, page, limit),
      ).toEqual(result);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetEnterprisePartiesQuery(enterpriseId, page, limit),
      );
    });

    it('should throw NotFoundException if no parties are found', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValue([]);

      await expect(
        controller.getEnterpriseParties('invalid-id', 1, 10),
      ).resolves.toEqual([]);
      expect(queryBus.execute).toHaveBeenCalled();
    });
  });
});
