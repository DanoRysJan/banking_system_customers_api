import { LoginDto } from '@core/auth/shared/dto/login.dto';
import { ICommand } from '@nestjs/cqrs';

export class LoginUserCommand implements ICommand {
  constructor(public readonly dto: LoginDto) {}
}
