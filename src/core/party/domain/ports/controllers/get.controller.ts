export interface GetEnterprisesByPartyIdControllerPort<B> {
  getEnterprisesByPartyId(
    partyId: string,
    page: number,
    limit: number,
  ): Promise<B>;
}
