import { ICommand } from '@nestjs/cqrs';
import { CreateEnterpriseDto } from '@core/enterprise/shared/dto/create-enterprise.dto';

export class CreateEnterpriseCommand implements ICommand {
  constructor(public readonly dto: CreateEnterpriseDto) {}
}
