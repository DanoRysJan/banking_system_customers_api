import { UpdatePartyCommand } from '../update-party.command';
import { RoleType } from '../../../../party/domain/models/party.entity';

describe('UpdatePartyCommand', () => {
  it('should create an instance with correct properties', () => {
    const command = new UpdatePartyCommand(
      'enterprise-123',
      'party-123',
      RoleType.EMPLOYEE,
    );
    expect(command).toBeDefined();
    expect(command.enterpriseId).toBe('enterprise-123');
    expect(command.partyId).toBe('party-123');
    expect(command.role).toBe(RoleType.EMPLOYEE);
  });
});
