import { UpdateEnterpriseDto } from '@core/enterprise/shared/dto/update-enterprise.dto';
import { ICommand } from '@nestjs/cqrs';

export class UpdateEnterpriseCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateEnterpriseDto,
  ) {}
}
