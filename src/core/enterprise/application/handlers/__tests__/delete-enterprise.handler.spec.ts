import { Test, TestingModule } from '@nestjs/testing';
import { DeleteEnterpriseHandler } from '../delete-enterprise.handler';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { DeleteEnterpriseCommand } from '../../commands/delete-enterprise.command';
import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import { AppResponse } from '../../../../common/infrastructure/models/api.response';
import { HttpStatus } from '@nestjs/common';
import { EnterpriseType } from '../../../../enterprise/domain/models/enterprise.entity';

describe('DeleteEnterpriseHandler', () => {
  let handler: DeleteEnterpriseHandler;
  let enterpriseRepository: IEnterpriseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteEnterpriseHandler,
        {
          provide: 'IEnterpriseRepository',
          useValue: {
            findById: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteEnterpriseHandler>(DeleteEnterpriseHandler);
    enterpriseRepository = module.get<IEnterpriseRepository>(
      'IEnterpriseRepository',
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should delete an enterprise successfully', async () => {
    const id = '1';
    const command = new DeleteEnterpriseCommand(id);
    const existingEnterprise = {
      id,
      name: 'Test Enterprise',
      type: EnterpriseType.COMPANY,
      legalBusinessName: 'Legal Business Name',
      taxIdNumber: '123456789',
      email: 'test@example.com',
      phone: '1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      parties: [],
      users: [],
      user: {
        id: 'user-id',
        fullName: 'Test User',
        username: 'testuser',
        email: 'testuser@example.com',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
        enterprises: [],
        role: { id: 'role-123', name: 'User', code: 'user-code', users: [] },
        parties: [],
        password: 'password123',
      },
      addresses: [],
    };
    jest
      .spyOn(enterpriseRepository, 'findById')
      .mockResolvedValue(existingEnterprise);
    jest.spyOn(enterpriseRepository, 'softDelete').mockResolvedValue(undefined);

    const result = await handler.execute(command);

    expect(result).toEqual<AppResponse<null>>({
      status: HttpStatus.OK,
      message: `Enterprise(id=${id}) deleted successfully!.`,
    });
    expect(enterpriseRepository.findById).toHaveBeenCalledWith(id);
    expect(enterpriseRepository.softDelete).toHaveBeenCalledWith(id);
  });

  it('should throw EntityNotFoundError if the enterprise does not exist', async () => {
    const id = '1';
    const command = new DeleteEnterpriseCommand(id);
    jest.spyOn(enterpriseRepository, 'findById').mockResolvedValue(null);

    await expect(handler.execute(command)).rejects.toThrow(EntityNotFoundError);
    await expect(handler.execute(command)).rejects.toThrowError(
      `Enterprise with ID ${id} not found`,
    );
  });

  it('should rethrow other errors', async () => {
    const id = '1';
    const command = new DeleteEnterpriseCommand(id);
    const error = new Error('Some other error');
    jest.spyOn(enterpriseRepository, 'findById').mockRejectedValue(error);

    await expect(handler.execute(command)).rejects.toThrow(error);
  });
});
