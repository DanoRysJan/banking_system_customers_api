import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEnterprisePartiesQuery } from '../queries/get-enterprise-parties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, NotFoundException } from '@nestjs/common';
import { Party } from '../../..//party/domain/models/party.entity';
import { Enterprise } from '../../..//enterprise/domain/models/enterprise.entity';
import { PartyRepositoryImpl } from '../../..//party/infrastructure/repositories/party.repository.impl';

@QueryHandler(GetEnterprisePartiesQuery)
export class GetEnterprisePartiesHandler
  implements IQueryHandler<GetEnterprisePartiesQuery>
{
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @Inject('IPartyRepository')
    private readonly partyRepository: PartyRepositoryImpl,
  ) {}

  async execute(query: GetEnterprisePartiesQuery) {
    const { enterpriseId, page, limit } = query;

    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new NotFoundException('Enterprise not found');

    const data = await this.partyRepository.findByEnterprise(
      enterpriseId,
      page,
      limit,
    );

    return data;
  }
}
