export interface CreateEnterpriseControllerPort<R, B> {
  create(user: { id: string }, dto: R): Promise<B>;
}

export interface AddPartyToEnterpriseControllerPort<R, B> {
  addPartyToEnterprise(userId: string, dto: R): Promise<B>;
}
