import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../../domain/models/user.entity';
import { IUserRepository } from '../../domain/ports/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  async create(user: DeepPartial<User>): Promise<User> {
    const userCreated = this.repository.create(user);
    return this.repository.save(userCreated);
  }
}
