import { RoleType } from '@core/party/domain/models/party.entity';
import { ICommand } from '@nestjs/cqrs';

export class UpdatePartyCommand implements ICommand {
  constructor(
    public readonly enterpriseId: string,
    public readonly partyId: string,
    public readonly role: RoleType,
  ) {}
}
