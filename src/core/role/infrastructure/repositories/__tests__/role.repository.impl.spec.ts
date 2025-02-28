import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleRepositoryImpl } from '../role.repository.impl';
import { Role } from '../../../../role/domain/models/role.entity';

const mockRole = new Role();
mockRole.code = 'ADMIN';

describe('RoleRepositoryImpl', () => {
  let repository: RoleRepositoryImpl;
  let roleRepo: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepositoryImpl,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockRole),
          },
        },
      ],
    }).compile();

    repository = module.get<RoleRepositoryImpl>(RoleRepositoryImpl);
    roleRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return a role when findByCode is called', async () => {
    const result = await repository.findByCode('ADMIN');
    expect(result).toEqual(mockRole);
    expect(roleRepo.findOneBy).toHaveBeenCalledWith({ code: 'ADMIN' });
  });

  it('should return null if role is not found', async () => {
    jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
    const result = await repository.findByCode('UNKNOWN');
    expect(result).toBeNull();
  });
});
