import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../../user/domain/models/user.entity';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { PartyRepositoryImpl } from '../party.repository.impl';
import { Party, RoleType } from '../../../../party/domain/models/party.entity';

describe('PartyRepositoryImpl', () => {
  let repository: Repository<Party>;
  let partyRepository: PartyRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartyRepositoryImpl,
        {
          provide: getRepositoryToken(Party),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<Repository<Party>>(getRepositoryToken(Party));
    partyRepository = module.get<PartyRepositoryImpl>(PartyRepositoryImpl);
  });

  it('should be defined', () => {
    expect(partyRepository).toBeDefined();
  });

  it('should create a party', async () => {
    const user = new User();
    const enterprise = new Enterprise();
    const role: RoleType = RoleType.ADMIN;

    const party = new Party();
    party.user = user;
    party.enterprise = enterprise;
    party.role = role;

    jest.spyOn(repository, 'create').mockReturnValue(party);
    jest.spyOn(repository, 'save').mockResolvedValue(party);

    const result = await partyRepository.create(user, enterprise, role);
    expect(result).toEqual(party);
    expect(repository.create).toHaveBeenCalledWith({ user, enterprise, role });
    expect(repository.save).toHaveBeenCalledWith(party);
  });

  it('should find a party by id', async () => {
    const party = new Party();
    jest.spyOn(repository, 'findOne').mockResolvedValue(party);

    const result = await partyRepository.findById('1');
    expect(result).toEqual(party);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['user', 'enterprise'],
    });
  });

  it('should find a party by user and enterprise', async () => {
    const party = new Party();
    const user = new User();
    const enterprise = new Enterprise();

    jest.spyOn(repository, 'findOne').mockResolvedValue(party);

    const result = await partyRepository.findByUserAndEnterprise(
      user,
      enterprise,
    );
    expect(result).toEqual(party);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { user, enterprise },
      relations: ['user', 'enterprise'],
    });
  });

  it('should find parties by enterprise with pagination', async () => {
    const party = new Party();
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[party], 1]),
    } as any);

    const result = await partyRepository.findByEnterprise('1', 1, 10);
    expect(result).toEqual({ data: [party], total: 1 });
  });

  it('should update a party', async () => {
    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    await partyRepository.update('1', { role: RoleType.ADMIN });
    expect(repository.update).toHaveBeenCalledWith('1', {
      role: RoleType.ADMIN,
    });
  });

  it('should delete a party', async () => {
    jest.spyOn(repository, 'softDelete').mockResolvedValue(undefined);
    await partyRepository.delete('1');
    expect(repository.softDelete).toHaveBeenCalledWith('1');
  });

  it('should get enterprises by party id with pagination', async () => {
    const enterprise = new Enterprise();
    const party = new Party();
    party.enterprise = enterprise;

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[party], 1]),
    } as any);

    const result = await partyRepository.getEnterprisesByPartyId('1', 1, 10);
    expect(result).toEqual({
      data: [enterprise],
      count: 1,
      page: 1,
      limit: 10,
    });
  });
});
