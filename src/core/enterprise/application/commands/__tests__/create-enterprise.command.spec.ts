import { mockCreateEnterpriseDto } from '../../../../../../test/mocks/dtos/create-enterprise.dto.mock';
import { CreateEnterpriseCommand } from '../create-enterprise.command';

describe('CreateEnterpriseCommand', () => {
  it('should create an instance with correct DTO', () => {
    const dto = mockCreateEnterpriseDto;
    const command = new CreateEnterpriseCommand(dto);
    expect(command).toBeDefined();
    expect(command.dto).toBe(dto);
  });
});
