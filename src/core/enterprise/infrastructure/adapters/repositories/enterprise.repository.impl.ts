import { EntityNotFoundError } from '../../../../common/domain/exceptions/entity-not-found.error';
import {
  Enterprise,
  EnterpriseType,
} from '../../../../enterprise/domain/models/enterprise.entity';
import { IEnterpriseRepository } from '../../../../enterprise/domain/ports/repositories/repositories/enterprise.repository';
import { CreateEnterpriseDto } from '../../../../enterprise/shared/dto/create-enterprise.dto';
import { UserRepositoryImpl } from '../../../../user/infrastructure/repositories/user.repository.impl';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class EnterpriseRepositoryImpl implements IEnterpriseRepository {
  constructor(
    @InjectRepository(Enterprise)
    private readonly repository: Repository<Enterprise>,
    @Inject('IUserRepository')
    private readonly userRepository: UserRepositoryImpl,
  ) {}

  async findById(id: string): Promise<Enterprise | null> {
    return this.repository.findOneBy({ id });
  }

  async findByType(type: EnterpriseType): Promise<Enterprise[]> {
    return this.repository.find({ where: { type } });
  }

  async create(enterprise: CreateEnterpriseDto): Promise<Enterprise> {
    const user = await this.userRepository.findById(enterprise.userId);
    if (!user) {
      throw new EntityNotFoundError(enterprise.userId);
    }

    const newEnterprise = this.repository.create({
      ...enterprise,
      user,
    });

    return this.repository.save(newEnterprise);
  }

  async update(
    id: string,
    enterprise: DeepPartial<Enterprise>,
  ): Promise<Enterprise> {
    await this.repository.update(id, enterprise);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async findAll(
    page: number,
    limit: number,
    type?: EnterpriseType,
  ): Promise<{ data: Enterprise[]; total: number }> {
    const queryBuilder = this.repository
      .createQueryBuilder('enterprise')
      .leftJoinAndSelect('enterprise.user', 'user');

    if (type) {
      queryBuilder.where('enterprise.type = :type', { type });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }
}
