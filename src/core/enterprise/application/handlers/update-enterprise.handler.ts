import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEnterpriseCommand } from '../commands/update-enterprise.command';
import { Enterprise } from '../../domain/models/enterprise.entity';
import { Inject } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { EntityNotFoundError } from '../../../common/domain/exceptions/entity-not-found.error';

@CommandHandler(UpdateEnterpriseCommand)
export class UpdateEnterpriseHandler
  implements ICommandHandler<UpdateEnterpriseCommand>
{
  constructor(
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  async execute(command: UpdateEnterpriseCommand): Promise<Enterprise> {
    const { id, dto } = command;

    const existingEnterprise = await this.enterpriseRepository.findById(id);
    if (!existingEnterprise) {
      throw new EntityNotFoundError(`Enterprise with ID ${id} not found`);
    }

    return this.enterpriseRepository.update(id, dto);
  }
}
