export interface GetEnterpriseControllerPort<A, B, C> {
  findAll(productOptions: A): Promise<C>;
  findById(id: string): Promise<B>;
}

export interface GetEnterprisePartiesControllerPort<B> {
  getEnterpriseParties(
    enterpriseId: string,
    page: number,
    limit: number,
  ): Promise<B>;
}
