import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from '../commands/login-user.command';
import { AuthService } from '../../domain/services/auth.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginUserCommand) {
    const user = await this.authService.validateUser(
      command.dto.email,
      command.dto.password,
    );
    return this.authService.login(user);
  }
}
