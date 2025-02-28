import { ICommand } from '@nestjs/cqrs';
import { RegisterUserDto } from '@core/auth/shared/dto/register.dto';

export class RegisterUserCommand implements ICommand {
  constructor(public readonly dto: RegisterUserDto) {}
}
