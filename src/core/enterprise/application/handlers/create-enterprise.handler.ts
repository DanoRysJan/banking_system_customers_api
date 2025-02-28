import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Enterprise } from '../../domain/models/enterprise.entity';
import { CreateEnterpriseCommand } from '../commands/create-enterprise.command';
import { Inject } from '@nestjs/common';
import { IEnterpriseRepository } from '../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';

@CommandHandler(CreateEnterpriseCommand)
export class CreateEnterpriseHandler
  implements ICommandHandler<CreateEnterpriseCommand>
{
  constructor(
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  async execute(command: CreateEnterpriseCommand): Promise<Enterprise> {
    return this.enterpriseRepository.create(command.dto);
  }
}
