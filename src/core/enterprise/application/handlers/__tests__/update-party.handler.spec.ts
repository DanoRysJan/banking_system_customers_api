import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePartyHandler } from '../update-party.handler';
import { PartyRepositoryImpl } from '../../../../party/infrastructure/repositories/party.repository.impl';
import { EnterpriseRepositoryImpl } from '../../../../enterprise/infrastructure/adapters/repositories/enterprise.repository.impl';
import { UpdatePartyCommand } from '../../commands/update-party.command';
import { Party, RoleType } from '../../../../party/domain/models/party.entity';
import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import { HttpStatus } from '@nestjs/common';
import {
  Enterprise,
  EnterpriseType,
} from '../../../../enterprise/domain/models/enterprise.entity';
import { User } from '../../../../user/domain/models/user.entity';

describe('UpdatePartyHandler', () => {
  let handler: UpdatePartyHandler;
  let partyRepository: PartyRepositoryImpl;
  let enterpriseRepository: EnterpriseRepositoryImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePartyHandler,
        {
          provide: 'IPartyRepository',
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdatePartyHandler>(UpdatePartyHandler);
    partyRepository = module.get<PartyRepositoryImpl>('IPartyRepository');
    enterpriseRepository = module.get<EnterpriseRepositoryImpl>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should update a party when enterprise and party exist', async () => {
    const partyId = '1';
    const enterpriseId = '1';
    const role = RoleType.EMPLOYEE;
    const command = new UpdatePartyCommand(enterpriseId, partyId, role);
    const party = new Party();
    const enterprise: Enterprise = {
      id: enterpriseId,
      type: EnterpriseType.COMPANY,
      legalBusinessName: 'Test Enterprise',
      taxIdNumber: 'ABC1234567',
      email: 'test@enterprise.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: new User(),
      addresses: [],
      parties: [],
    };

    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(enterprise);
    jest.spyOn(partyRepository, 'findById').mockResolvedValue(party);
    jest.spyOn(partyRepository, 'update').mockResolvedValue(undefined); // update no devuelve nada

    const result = await handler.execute(command);

    expect(enterpriseRepository.findById).toHaveBeenCalledWith(enterpriseId);
    expect(partyRepository.findById).toHaveBeenCalledWith(partyId);
    expect(partyRepository.update).toHaveBeenCalledWith(
      partyId,
      expect.objectContaining({ role }),
    );
    expect(result).toEqual({
      status: HttpStatus.OK,
      message: `Party(id=${partyId}) updated successfully!.`,
    });
  });

  it('should throw EntityNotFoundError if the enterprise does not exist', async () => {
    const partyId = '1';
    const enterpriseId = '1';
    const role = RoleType.EMPLOYEE;
    const command = new UpdatePartyCommand(enterpriseId, partyId, role);

    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(EntityNotFoundError);
    expect(enterpriseRepository.findById).toHaveBeenCalledWith(enterpriseId);
    expect(partyRepository.findById).not.toHaveBeenCalled();
    expect(partyRepository.update).not.toHaveBeenCalled();
  });

  it('should throw EntityNotFoundError if the party does not exist', async () => {
    const partyId = '1';
    const enterpriseId = '1';
    const role = RoleType.EMPLOYEE;
    const command = new UpdatePartyCommand(enterpriseId, partyId, role);
    const enterprise: Enterprise = {
      id: enterpriseId,
      type: EnterpriseType.COMPANY,
      legalBusinessName: 'Test Enterprise',
      taxIdNumber: 'ABC1234567',
      email: 'test@enterprise.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: new User(),
      addresses: [],
      parties: [],
    };

    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(enterprise);
    jest.spyOn(partyRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(EntityNotFoundError);
    expect(enterpriseRepository.findById).toHaveBeenCalledWith(enterpriseId);
    expect(partyRepository.findById).toHaveBeenCalledWith(partyId);
    expect(partyRepository.update).not.toHaveBeenCalled();
  });

  it('should rethrow other errors', async () => {
    const partyId = '1';
    const enterpriseId = '1';
    const role = RoleType.EMPLOYEE;
    const command = new UpdatePartyCommand(enterpriseId, partyId, role);
    const error = new Error('Some other error');

    jest.spyOn(enterpriseRepository, 'findById').mockRejectedValue(error);

    await expect(handler.execute(command)).rejects.toThrow(error);
  });
});
