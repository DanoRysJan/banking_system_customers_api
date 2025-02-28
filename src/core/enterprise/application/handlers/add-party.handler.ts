import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { AddPartyToEnterpriseCommand } from '../commands/add-party.command';
import { Party } from '../../../party/domain/models/party.entity';
import { Enterprise } from '../../../enterprise/domain/models/enterprise.entity';
import { UserRepositoryImpl } from '../../../user/infrastructure/repositories/user.repository.impl';
import { PartyRepositoryImpl } from '../../../party/infrastructure/repositories/party.repository.impl';

@CommandHandler(AddPartyToEnterpriseCommand)
export class AddPartyToEnterpriseHandler
  implements ICommandHandler<AddPartyToEnterpriseCommand>
{
  constructor(
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @Inject('IUserRepository')
    private readonly userRepository: UserRepositoryImpl,
    @Inject('IPartyRepository')
    private readonly partyRepository: PartyRepositoryImpl,
  ) {}

  async execute(command: AddPartyToEnterpriseCommand): Promise<Party> {
    const { enterpriseId, userId, role } = command;

    const enterprise = await this.enterpriseRepository.findOne({
      where: { id: enterpriseId },
    });
    if (!enterprise) throw new NotFoundException('Enterprise not found');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const existingParty = await this.partyRepository.findByUserAndEnterprise(
      user,
      enterprise,
    );

    if (existingParty)
      throw new ConflictException('User already in enterprise');

    return this.partyRepository.create(user, enterprise, role);
  }
}
