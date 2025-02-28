import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../../application/commands/login-user.command';
import { RegisterUserCommand } from '../../../application/commands/register-user.command';
import { LoginDto } from '../../../../auth/shared/dto/login.dto';
import { LoginControllerPort } from '../../../../auth/domain/ports/controllers/auth.controller.port';
import { RegisterUserDto } from '../../../../auth/shared/dto/register.dto';
import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../../../user/domain/models/user.entity';

@ApiTags('Authentication Controller')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/auth')
export class AuthController implements LoginControllerPort<LoginDto, string> {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Authenticates a user and returns an access token.',
  })
  @ApiConsumes('application/json')
  @ApiBody({ type: LoginDto, description: 'User credentials for login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: { example: { access_token: 'your_jwt_token' } },
  })
  async login(@Body() login: LoginDto) {
    return this.commandBus.execute(new LoginUserCommand(login));
  }

  @Post('register')
  @ApiOperation({
    summary: 'User Registration',
    description: 'Creates a new user and returns their details.',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    type: RegisterUserDto,
    description: 'User details for registration',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,
  })
  async register(@Body() register: RegisterUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(register));
  }
}
