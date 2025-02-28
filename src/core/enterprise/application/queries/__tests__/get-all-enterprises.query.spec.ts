import { EnterpriseType } from '../../../../enterprise/domain/models/enterprise.entity';
import { GetAllEnterprisesQuery } from '../get-enterprises.query';

describe('GetAllEnterprisesQuery', () => {
  it('should create an instance with required properties', () => {
    const query = new GetAllEnterprisesQuery(1, 10);
    expect(query).toBeDefined();
    expect(query.page).toBe(1);
    expect(query.limit).toBe(10);
    expect(query.type).toBeUndefined();
  });

  it('should create an instance with optional type property', () => {
    const query = new GetAllEnterprisesQuery(1, 10, EnterpriseType.COMPANY);
    expect(query).toBeDefined();
    expect(query.page).toBe(1);
    expect(query.limit).toBe(10);
    expect(query.type).toBe(EnterpriseType.COMPANY);
  });
});
