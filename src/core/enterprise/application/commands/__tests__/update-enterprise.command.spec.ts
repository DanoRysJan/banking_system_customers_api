import { UpdateEnterpriseCommand } from '../update-enterprise.command';
import { UpdateEnterpriseDto } from '@core/enterprise/shared/dto/update-enterprise.dto';

describe('UpdateEnterpriseCommand', () => {
  it('should create an instance with correct properties', () => {
    const dto: UpdateEnterpriseDto = {
      legalBusinessName: 'Acme Corp Inc',
    };
    const command = new UpdateEnterpriseCommand('enterprise-123', dto);
    expect(command).toBeDefined();
    expect(command.id).toBe('enterprise-123');
    expect(command.dto).toBe(dto);
  });
});
