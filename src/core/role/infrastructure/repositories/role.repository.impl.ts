import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../domain/models/role.entity';
import { IRoleRepository } from '../../domain/ports/repositories/role.repository';

@Injectable()
export class RoleRepositoryImpl implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  async findByCode(code: string): Promise<Role | null> {
    return this.repository.findOneBy({ code });
  }
}
