import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../queries/get-user.query';
import { IUserRepository } from '../../domain/ports/repositories/user.repository';
import { User } from '../../../user/domain/models/user.entity';
import { Inject } from '@nestjs/common';
import { EntityNotFoundError } from '../../../common/domain/exceptions/entity-not-found.error';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<User | null> {
    const user = await this.userRepository.findById(query.id);
    if (!user) {
      throw new EntityNotFoundError(query.id);
    }
    return user;
  }
}
