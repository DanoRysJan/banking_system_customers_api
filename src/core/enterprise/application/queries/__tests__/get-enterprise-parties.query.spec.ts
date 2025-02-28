import { GetEnterprisePartiesQuery } from '../get-enterprise-parties.query';

describe('GetEnterprisePartiesQuery', () => {
  it('should create an instance with correct properties', () => {
    const query = new GetEnterprisePartiesQuery('enterprise-123', 1, 10);
    expect(query).toBeDefined();
    expect(query.enterpriseId).toBe('enterprise-123');
    expect(query.page).toBe(1);
    expect(query.limit).toBe(10);
  });
});
