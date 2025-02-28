import { IQuery } from '@nestjs/cqrs';

export class GetEnterprisePartiesQuery implements IQuery {
  constructor(
    public readonly enterpriseId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
