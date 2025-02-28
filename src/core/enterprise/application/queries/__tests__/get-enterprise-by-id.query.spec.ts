import { GetEnterpriseByIdQuery } from '../get-enterprise-by-id.query';

describe('GetEnterpriseByIdQuery', () => {
  it('should create an instance with correct properties', () => {
    const query = new GetEnterpriseByIdQuery('enterprise-123');
    expect(query).toBeDefined();
    expect(query.id).toBe('enterprise-123');
  });
});
