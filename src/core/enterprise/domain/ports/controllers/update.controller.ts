export interface UpdateEnterpriseControllerPort<A, B, C> {
  update(id: A, dto: B): Promise<C>;
}

export interface UpdatePartyControllerPort<R, B> {
  updateParty(enterpriseId: string, partyId: string, dto: R): Promise<B>;
}
