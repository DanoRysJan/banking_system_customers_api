import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IUserRepository } from '../../../user/domain/ports/repositories/user.repository';
import { IRoleRepository } from '../../../role/domain/ports/repositories/role.repository';
import { User } from '../../../user/domain/models/user.entity';
import { DeepPartial } from 'typeorm';
import { RoleCode } from '../../../role/domain/models/role.entity';
import { EmailNotFoundError } from '../exceptions/user-email.exception';
import { RoleNotFoundError } from '../exceptions/rol.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new EmailNotFoundError(email);
    }

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user: DeepPartial<User>) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role.code,
    };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: DeepPartial<User>) {
    const role = await this.roleRepository.findByCode(RoleCode.REGULAR);

    if (!role) {
      throw new RoleNotFoundError(RoleCode.REGULAR);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    return this.userRepository.create({
      ...user,
      password: hashedPassword,
      role,
    });
  }
}
