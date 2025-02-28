import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register-user.command';
import { AuthService } from '../../../auth/domain/services/auth.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RegisterUserCommand) {
    const { fullName, username, email, password, phone } = command.dto;
    return this.authService.register({
      fullName,
      username,
      email,
      password,
      phone,
    });
  }
}
