import { ICommand } from '@nestjs/cqrs';

export class DeleteEnterpriseCommand implements ICommand {
  constructor(public readonly id: string) {}
}
