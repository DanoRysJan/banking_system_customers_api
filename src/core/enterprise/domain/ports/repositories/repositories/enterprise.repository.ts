import { AppResponse } from '@core/common/infrastructure/models/api.response';
import {
  Enterprise,
  EnterpriseType,
} from '@core/enterprise/domain/models/enterprise.entity';
import { CreateEnterpriseDto } from '@core/enterprise/shared/dto/create-enterprise.dto';
import { UpdateEnterpriseDto } from '@core/enterprise/shared/dto/update-enterprise.dto';

export interface IEnterpriseRepository {
  findById(id: string): Promise<Enterprise | null>;
  findByType(type: EnterpriseType): Promise<Enterprise[]>;
  create(enterprise: CreateEnterpriseDto): Promise<Enterprise>;
  update(id: string, enterprise: UpdateEnterpriseDto): Promise<Enterprise>;
  softDelete(id: string): Promise<void>;
  findAll(
    page: number,
    limit: number,
    type?: EnterpriseType,
  ): Promise<{ data: Enterprise[]; total: number }>;
}
