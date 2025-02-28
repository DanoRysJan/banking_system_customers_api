import { User } from '../../../src/core/user/domain/models/user.entity';
import { Role } from '../../../src/core/role/domain/models/role.entity';

export const mockUser: User = {
  id: '123',
  fullName: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  phone: '1234567890',
  createdAt: new Date(),
  updatedAt: new Date(),
  enterprises: [],
  role: {
    id: 'role-123',
    name: 'User',
    code: 'user-code',
    users: [],
  } as Role,
  parties: [],
  password: '',
};
