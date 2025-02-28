import { IQuery } from '@nestjs/cqrs';

export class GetEnterpriseByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
