import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseRepositoryImpl } from '../enterprise.repository.impl';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Enterprise,
  EnterpriseType,
} from '../../../../../enterprise/domain/models/enterprise.entity';
import { UserRepositoryImpl } from '../../../../../user/infrastructure/repositories/user.repository.impl';
import { CreateEnterpriseDto } from '../../../../../enterprise/shared/dto/create-enterprise.dto';
import { EntityNotFoundError } from '../../../../../common/domain/exceptions/entity-not-found.error';
import { DeepPartial } from 'typeorm';

describe('EnterpriseRepositoryImpl', () => {
  let repository: EnterpriseRepositoryImpl;
  let enterpriseRepo: Repository<Enterprise>;
  let userRepository: UserRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseRepositoryImpl,
        {
          provide: getRepositoryToken(Enterprise),
          useClass: Repository,
        },
        {
          provide: 'IUserRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<EnterpriseRepositoryImpl>(EnterpriseRepositoryImpl);
    enterpriseRepo = module.get<Repository<Enterprise>>(
      getRepositoryToken(Enterprise),
    );
    userRepository = module.get<UserRepositoryImpl>('IUserRepository');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should return an enterprise if found', async () => {
      const id = '123';
      const enterprise = new Enterprise();
      jest.spyOn(enterpriseRepo, 'findOneBy').mockResolvedValue(enterprise);

      const result = await repository.findById(id);
      expect(result).toEqual(enterprise);
    });

    it('should return null if no enterprise is found', async () => {
      jest.spyOn(enterpriseRepo, 'findOneBy').mockResolvedValue(null);

      const result = await repository.findById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('findByType', () => {
    it('should return a list of enterprises of the given type', async () => {
      const type = EnterpriseType.COMPANY;
      const enterprises = [new Enterprise()];
      jest.spyOn(enterpriseRepo, 'find').mockResolvedValue(enterprises);

      const result = await repository.findByType(type);
      expect(result).toEqual(enterprises);
    });
  });

  describe('create', () => {
    it('should create and return a new enterprise', async () => {
      const createDto: CreateEnterpriseDto = {
        type: EnterpriseType.COMPANY,
        legalBusinessName: 'Acme Corp',
        taxIdNumber: '12345619',
        email: 'contact@acmecorp.com',
        phone: '1234567890',
        userId: 'userid',
      };
      const user = { id: '123' }; // Simulating a user object

      jest.spyOn(userRepository, 'findById').mockResolvedValue(user as any);
      jest.spyOn(enterpriseRepo, 'create').mockReturnValue(new Enterprise());
      jest.spyOn(enterpriseRepo, 'save').mockResolvedValue(new Enterprise());

      const result = await repository.create(createDto);
      expect(result).toBeInstanceOf(Enterprise);
    });

    it('should throw EntityNotFoundError if user is not found', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      const createDto: CreateEnterpriseDto = {
        type: EnterpriseType.COMPANY,
        legalBusinessName: 'Acme Corp',
        taxIdNumber: '12345619',
        email: 'contact@acmecorp.com',
        phone: '1234567890',
        userId: 'userid',
      };

      await expect(repository.create(createDto)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });

  describe('update', () => {
    it('should update an enterprise and return the updated entity', async () => {
      const id = '123';
      const updateDto: DeepPartial<Enterprise> = {
        legalBusinessName: 'New Name',
      };
      const enterprise = new Enterprise();

      jest
        .spyOn(enterpriseRepo, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(repository, 'findById').mockResolvedValue(enterprise);

      const result = await repository.update(id, updateDto);
      expect(result).toBeInstanceOf(Enterprise);
    });
  });

  describe('softDelete', () => {
    it('should soft delete an enterprise', async () => {
      const id = '123';
      jest
        .spyOn(enterpriseRepo, 'softDelete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(repository.softDelete(id)).resolves.toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated enterprises', async () => {
      const page = 1,
        limit = 10;
      const enterprises = [new Enterprise()];
      jest.spyOn(enterpriseRepo, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([enterprises, 1]),
      } as any);

      const result = await repository.findAll(page, limit);
      expect(result).toEqual({ data: enterprises, total: 1 });
    });
  });
});
