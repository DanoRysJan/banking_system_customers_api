import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEnterpriseByIdQuery } from '../queries/get-enterprise-by-id.query';
import { Enterprise } from '../../domain/models/enterprise.entity';
import { Inject } from '@nestjs/common';
import { EntityNotFoundError } from '../../../common/domain/exceptions/entity-not-found.error';
import { IEnterpriseRepository } from '../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';

@QueryHandler(GetEnterpriseByIdQuery)
export class GetEnterpriseByIdHandler
  implements IQueryHandler<GetEnterpriseByIdQuery>
{
  constructor(
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  async execute(query: GetEnterpriseByIdQuery): Promise<Enterprise> {
    const enterprise = await this.enterpriseRepository.findById(query.id);
    if (!enterprise) {
      throw new EntityNotFoundError(`Enterprise with ID ${query.id} not found`);
    }
    return enterprise;
  }
}
