import { RoleType } from '@core/party/domain/models/party.entity';
import { ICommand } from '@nestjs/cqrs';

export class AddPartyToEnterpriseCommand implements ICommand {
  constructor(
    public readonly enterpriseId: string,
    public readonly userId: string,
    public readonly role: RoleType,
  ) {}
}
