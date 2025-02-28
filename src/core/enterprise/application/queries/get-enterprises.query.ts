import { IQuery } from '@nestjs/cqrs';
import { EnterpriseType } from '../../domain/models/enterprise.entity';

export class GetAllEnterprisesQuery implements IQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly type?: EnterpriseType,
  ) {}
}
