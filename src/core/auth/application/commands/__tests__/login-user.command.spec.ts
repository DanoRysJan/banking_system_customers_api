import { LoginUserCommand } from '../login-user.command';
import { LoginDto } from '../../../../auth/shared/dto/login.dto';
import { loginDtoMock } from '../../../../../../test/mocks/dtos/login.dto.mock';

describe('LoginUserCommand', () => {
  it('should create a LoginUserCommand with the given DTO', () => {
    const dto: LoginDto = loginDtoMock;
    const command = new LoginUserCommand(dto);

    expect(command).toBeDefined();
    expect(command.dto).toEqual(dto);
  });
});
