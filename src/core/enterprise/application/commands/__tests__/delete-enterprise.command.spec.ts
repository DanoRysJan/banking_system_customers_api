import { DeleteEnterpriseCommand } from '../delete-enterprise.command';

describe('DeleteEnterpriseCommand', () => {
  it('should create an instance with correct ID', () => {
    const command = new DeleteEnterpriseCommand('enterprise-123');
    expect(command).toBeDefined();
    expect(command.id).toBe('enterprise-123');
  });
});
