import { AddPartyToEnterpriseCommand } from '../add-party.command';
import { RoleType } from '../../../../party/domain/models/party.entity';

describe('AddPartyToEnterpriseCommand', () => {
  it('should create an instance with correct properties', () => {
    const command = new AddPartyToEnterpriseCommand(
      'enterprise-123',
      'user-456',
      RoleType.ADMIN,
    );
    expect(command).toBeDefined();
    expect(command.enterpriseId).toBe('enterprise-123');
    expect(command.userId).toBe('user-456');
    expect(command.role).toBe(RoleType.ADMIN);
  });
});
