import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEnterpriseCommand } from '../commands/delete-enterprise.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { EntityNotFoundError } from '../../..//common/domain/exceptions/entity-not-found.error';
import { IEnterpriseRepository } from '../../..//enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { AppResponse } from '../../..//common/infrastructure/models/api.response';

@CommandHandler(DeleteEnterpriseCommand)
export class DeleteEnterpriseHandler
  implements ICommandHandler<DeleteEnterpriseCommand>
{
  constructor(
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  async execute(command: DeleteEnterpriseCommand): Promise<AppResponse<null>> {
    const { id } = command;

    const existingEnterprise = await this.enterpriseRepository.findById(id);
    if (!existingEnterprise) {
      throw new EntityNotFoundError(`Enterprise with ID ${id} not found`);
    }

    await this.enterpriseRepository.softDelete(id);

    const response: AppResponse<null> = {
      status: HttpStatus.OK,
      message: `Enterprise(id=${id}) deleted successfully!.`,
    };

    return response;
  }
}
