import { EnterpriseType } from '../../../src/core/enterprise/domain/models/enterprise.entity';
import { CreateEnterpriseDto } from '../../../src/core/enterprise/shared/dto/create-enterprise.dto';

export const mockCreateEnterpriseDto: CreateEnterpriseDto = {
  type: EnterpriseType.COMPANY,
  legalBusinessName: 'Acme Corp',
  taxIdNumber: '12345619',
  email: 'contact@acmecorp.com',
  phone: '1234567890',
  userId: 'userid',
};
