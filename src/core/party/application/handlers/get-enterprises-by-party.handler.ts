import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IPartyRepository } from '../../domain/ports/repositories/party.repository';
import { Enterprise } from '@core/enterprise/domain/models/enterprise.entity';
import { GetEnterprisesByPartyIdQuery } from '../queries/get-enterprises-by-party.query';
import { Paginated } from '@core/common/domain/interfaces/pagination.interface';

@QueryHandler(GetEnterprisesByPartyIdQuery)
export class GetEnterprisesByPartyIdHandler
  implements IQueryHandler<GetEnterprisesByPartyIdQuery>
{
  constructor(
    @Inject('IPartyRepository')
    private readonly partyRepository: IPartyRepository,
  ) {}

  async execute(
    query: GetEnterprisesByPartyIdQuery,
  ): Promise<Paginated<Enterprise>> {
    return this.partyRepository.getEnterprisesByPartyId(
      query.partyId,
      query.page,
      query.limit,
    );
  }
}
