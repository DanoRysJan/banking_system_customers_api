import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Party, RoleType } from '../../domain/models/party.entity';
import { IPartyRepository } from '@core/party/domain/ports/repositories/party.repository';
import { User } from '@core/user/domain/models/user.entity';
import { Enterprise } from '@core/enterprise/domain/models/enterprise.entity';
import { Paginated } from '@core/common/domain/interfaces/pagination.interface';

@Injectable()
export class PartyRepositoryImpl implements IPartyRepository {
  constructor(
    @InjectRepository(Party)
    private readonly repository: Repository<Party>,
  ) {}

  async create(
    user: User,
    enterprise: Enterprise,
    role: RoleType,
  ): Promise<Party> {
    const party = this.repository.create({ user, enterprise, role });
    return this.repository.save(party);
  }

  async findById(id: string): Promise<Party | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'enterprise'],
    });
  }

  async findByUserAndEnterprise(
    user: User,
    enterprise: Enterprise,
  ): Promise<Party | null> {
    return this.repository.findOne({
      where: { user, enterprise },
      relations: ['user', 'enterprise'],
    });
  }

  async findByEnterprise(
    enterpriseId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Party[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.user', 'user')
      .where('party.enterpriseId = :enterpriseId', { enterpriseId })
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  async update(id: string, party: Partial<Party>): Promise<void> {
    await this.repository.update(id, party);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async getEnterprisesByPartyId(
    partyId: string,
    page: number,
    limit: number,
  ): Promise<Paginated<Enterprise>> {
    const queryBuilder = this.repository
      .createQueryBuilder('party')
      .leftJoinAndSelect('party.enterprise', 'enterprise')
      .where('party.id = :partyId', { partyId })
      .skip((page - 1) * limit)
      .take(limit);

    const [parties, total] = await queryBuilder.getManyAndCount();
    const data = parties.map((party) => party.enterprise);

    return { data, count: total, page, limit };
  }
}
