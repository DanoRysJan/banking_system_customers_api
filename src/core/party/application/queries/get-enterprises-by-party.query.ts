import { IQuery } from '@nestjs/cqrs';

export class GetEnterprisesByPartyIdQuery implements IQuery {
  constructor(
    public readonly partyId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
