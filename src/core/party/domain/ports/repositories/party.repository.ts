import { User } from '@core/user/domain/models/user.entity';
import { Party, RoleType } from '../../models/party.entity';
import { Enterprise } from '@core/enterprise/domain/models/enterprise.entity';
import { Paginated } from '@core/common/domain/interfaces/pagination.interface';

export interface IPartyRepository {
  create(user: User, enterprise: Enterprise, role: RoleType): Promise<Party>;
  findById(id: string): Promise<Party | null>;
  findByUserAndEnterprise(
    user: User,
    enterprise: Enterprise,
  ): Promise<Party | null>;
  findByEnterprise(
    enterpriseId: string,
    page: number,
    limit: number,
  ): Promise<{ data: Party[]; total: number }>;
  update(id: string, party: Partial<Party>): Promise<void>;
  delete(id: string): Promise<void>;
  getEnterprisesByPartyId(
    partyId: string,
    page: number,
    limit: number,
  ): Promise<Paginated<Enterprise>>;
}
