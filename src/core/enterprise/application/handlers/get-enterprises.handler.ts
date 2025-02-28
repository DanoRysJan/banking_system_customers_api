import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Enterprise } from '../../domain/models/enterprise.entity';
import { GetAllEnterprisesQuery } from '../queries/get-enterprises.query';
import { IEnterpriseRepository } from '@core/enterprise/domain/ports/repositories/repositories/enterprise.repository';

@QueryHandler(GetAllEnterprisesQuery)
export class GetAllEnterprisesHandler
  implements IQueryHandler<GetAllEnterprisesQuery>
{
  constructor(
    @Inject('IEnterpriseRepository')
    private readonly enterpriseRepository: IEnterpriseRepository,
  ) {}

  async execute(query: GetAllEnterprisesQuery): Promise<{
    data: Enterprise[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page, limit, type } = query;
    const { data, total } = await this.enterpriseRepository.findAll(
      page,
      limit,
      type,
    );

    return { data, total, page, limit };
  }
}
