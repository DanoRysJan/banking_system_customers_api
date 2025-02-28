import { DeepPartial } from 'typeorm';
import { User } from '../../models/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByUsername(name: string): Promise<User | null>;
  create(user: DeepPartial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
