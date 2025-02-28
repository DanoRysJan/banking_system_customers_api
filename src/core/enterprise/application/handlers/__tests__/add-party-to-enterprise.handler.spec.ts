import { Test, TestingModule } from '@nestjs/testing';
import { AddPartyToEnterpriseHandler } from '../add-party.handler';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { Party, RoleType } from '../../../../party/domain/models/party.entity';
import { User } from '../../../../user/domain/models/user.entity';
import { UserRepositoryImpl } from '../../../../user/infrastructure/repositories/user.repository.impl';
import { PartyRepositoryImpl } from '../../../../party/infrastructure/repositories/party.repository.impl';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddPartyToEnterpriseCommand } from '../../commands/add-party.command';

describe('AddPartyToEnterpriseHandler', () => {
  let handler: AddPartyToEnterpriseHandler;
  let enterpriseRepository: Repository<Enterprise>;
  let userRepository: UserRepositoryImpl;
  let partyRepository: PartyRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddPartyToEnterpriseHandler,
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
        {
          provide: 'IPartyRepository',
          useValue: {
            findByUserAndEnterprise: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<AddPartyToEnterpriseHandler>(
      AddPartyToEnterpriseHandler,
    );
    enterpriseRepository = module.get<Repository<Enterprise>>(
      getRepositoryToken(Enterprise),
    );
    userRepository = module.get<UserRepositoryImpl>('IUserRepository');
    partyRepository = module.get<PartyRepositoryImpl>('IPartyRepository');
  });

  it('should throw NotFoundException if enterprise does not exist', async () => {
    jest.spyOn(enterpriseRepository, 'findOne').mockResolvedValue(null);

    const command = new AddPartyToEnterpriseCommand(
      'enterprise-id',
      'user-id',
      RoleType.EMPLOYEE,
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    jest.spyOn(enterpriseRepository, 'findOne').mockResolvedValue({
      id: 'enterprise-id',
      type: 'type',
      legalBusinessName: 'legalBusinessName',
      taxIdNumber: 'taxIdNumber',
      email: 'email@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      parties: [],
      users: [],
    } as unknown as Enterprise);
    jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

    const command = new AddPartyToEnterpriseCommand(
      'enterprise-id',
      'user-id',
      RoleType.EMPLOYEE,
    );

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it('should throw ConflictException if user is already in enterprise', async () => {
    jest.spyOn(enterpriseRepository, 'findOne').mockResolvedValue({
      id: 'enterprise-id',
      type: 'type',
      legalBusinessName: 'legalBusinessName',
      taxIdNumber: 'taxIdNumber',
      email: 'email@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      parties: [],
      users: [],
    } as unknown as Enterprise);
    jest.spyOn(userRepository, 'findById').mockResolvedValue({
      id: 'user-id',
      fullName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      enterprises: [],
      role: { id: 'role-123', name: 'User', code: 'user-code', users: [] },
      parties: [],
    } as unknown as User);
    jest.spyOn(partyRepository, 'findByUserAndEnterprise').mockResolvedValue({
      id: 'party-id',
      user: { id: 'user-id' } as User,
      enterprise: { id: 'enterprise-id' } as Enterprise,
      role: RoleType.EMPLOYEE,
    } as Party);

    const command = new AddPartyToEnterpriseCommand(
      'enterprise-id',
      'user-id',
      RoleType.EMPLOYEE,
    );

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
  });

  it('should create a new party and return it', async () => {
    const enterprise = { id: 'enterprise-id' } as Enterprise;
    const user = { id: 'user-id' } as User;
    const newParty = {
      id: 'party-id',
      user,
      enterprise,
      role: RoleType.EMPLOYEE,
    } as Party;

    jest.spyOn(enterpriseRepository, 'findOne').mockResolvedValue(enterprise);
    jest.spyOn(userRepository, 'findById').mockResolvedValue(user);
    jest
      .spyOn(partyRepository, 'findByUserAndEnterprise')
      .mockResolvedValue(null);
    jest.spyOn(partyRepository, 'create').mockResolvedValue(newParty);

    const command = new AddPartyToEnterpriseCommand(
      'enterprise-id',
      'user-id',
      RoleType.EMPLOYEE,
    );

    const result = await handler.execute(command);

    expect(result).toEqual(newParty);
    expect(partyRepository.create).toHaveBeenCalledWith(
      user,
      enterprise,
      RoleType.EMPLOYEE,
    );
  });
});
