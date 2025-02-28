import { Role } from '../../models/role.entity';

export interface IRoleRepository {
  findByCode(code: string): Promise<Role | null>;
}
