import { registerUserDtoMock } from '../../../../../../test/mocks/dtos/register-user.dto.mock';
import { RegisterUserCommand } from '../register-user.command';
import { RegisterUserDto } from '../../../../auth/shared/dto/register.dto';

describe('RegisterUserCommand', () => {
  it('should create a RegisterUserCommand with the given DTO', () => {
    const dto: RegisterUserDto = registerUserDtoMock;
    const command = new RegisterUserCommand(dto);

    expect(command).toBeDefined();
    expect(command.dto).toEqual(dto);
  });
});
