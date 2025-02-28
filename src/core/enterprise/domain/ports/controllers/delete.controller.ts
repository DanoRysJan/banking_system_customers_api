export interface DeleteEnterpriseControllerPort<A, B> {
  delete(id: A): Promise<B>;
}
