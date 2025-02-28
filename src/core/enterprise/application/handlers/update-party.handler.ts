import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePartyCommand } from '../commands/update-party.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { PartyRepositoryImpl } from '../../../party/infrastructure/repositories/party.repository.impl';
import { EntityNotFoundError } from '../../../common/domain/exceptions/entity-not-found.error';
import { EnterpriseRepositoryImpl } from '../../../enterprise/infrastructure/adapters/repositories/enterprise.repository.impl';
import { AppResponse } from '@core/common/infrastructure/models/api.response';

@CommandHandler(UpdatePartyCommand)
export class UpdatePartyHandler implements ICommandHandler<UpdatePartyCommand> {
  constructor(
    @Inject('IPartyRepository')
    private readonly partyRepository: PartyRepositoryImpl,
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: EnterpriseRepositoryImpl,
  ) {}

  async execute(command: UpdatePartyCommand): Promise<AppResponse<null>> {
    const { enterpriseId, partyId, role } = command;

    const enterprise = await this.enterpriseRepository.findById(enterpriseId);
    if (!enterprise) throw new EntityNotFoundError(enterpriseId);

    const party = await this.partyRepository.findById(partyId);
    if (!party) throw new EntityNotFoundError(partyId);

    party.role = role;
    await this.partyRepository.update(partyId, party);

    const response: AppResponse<null> = {
      status: HttpStatus.OK,
      message: `Party(id=${partyId}) updated successfully!.`,
    };
    return response;
  }
}
