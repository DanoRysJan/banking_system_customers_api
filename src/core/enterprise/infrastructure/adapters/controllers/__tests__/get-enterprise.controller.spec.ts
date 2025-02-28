import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllEnterprisesQuery } from '../../../../../enterprise/application/queries/get-enterprises.query';
import { GetEnterpriseByIdQuery } from '../../../../../enterprise/application/queries/get-enterprise-by-id.query';
import { JwtAuthGuard } from '../../../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../../auth/application/guards/roles.guard';
import { ExecutionContext } from '@nestjs/common';
import { RoleCode } from '../../../../../role/domain/models/role.entity';
import { GetEnterpriseController } from '../get.controller';
import { EnterpriseType } from '../../../../../enterprise/domain/models/enterprise.entity';

describe('GetEnterpriseController', () => {
  let controller: GetEnterpriseController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetEnterpriseController],
      providers: [
        QueryBus,
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: RolesGuard,
          useValue: {
            canActivate: jest
              .fn()
              .mockImplementation((context: ExecutionContext) => {
                const roles = Reflect.getMetadata(
                  'roles',
                  context.getHandler(),
                );
                return (
                  roles.includes(RoleCode.REGULAR) ||
                  roles.includes(RoleCode.ADMIN)
                );
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<GetEnterpriseController>(GetEnterpriseController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call queryBus.execute with GetAllEnterprisesQuery', async () => {
      const queryBusExecuteSpy = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue({ items: [], total: 0 });

      const params = { page: 1, limit: 10, type: EnterpriseType.COMPANY };
      await controller.findAll(params);

      expect(queryBusExecuteSpy).toHaveBeenCalledWith(
        new GetAllEnterprisesQuery(1, 10, EnterpriseType.COMPANY),
      );
    });

    it('should return a paginated list of enterprises', async () => {
      const mockResult = {
        items: [{ id: '1', name: 'Enterprise 1' }],
        total: 1,
      };
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockResult);

      const result = await controller.findAll({
        page: 1,
        limit: 10,
        type: EnterpriseType.COMPANY,
      });

      expect(result).toEqual(mockResult);
    });
  });

  describe('findById', () => {
    it('should call queryBus.execute with GetEnterpriseByIdQuery', async () => {
      const queryBusExecuteSpy = jest
        .spyOn(queryBus, 'execute')
        .mockResolvedValue({ id: '1', name: 'Enterprise 1' });

      const id = '123e4567-e89b-12d3-a456-426614174000';
      await controller.findById(id);

      expect(queryBusExecuteSpy).toHaveBeenCalledWith(
        new GetEnterpriseByIdQuery(id),
      );
    });

    it('should return an enterprise', async () => {
      const mockEnterprise = { id: '1', name: 'Enterprise 1' };
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockEnterprise);

      const result = await controller.findById('1');

      expect(result).toEqual(mockEnterprise);
    });
  });
});
