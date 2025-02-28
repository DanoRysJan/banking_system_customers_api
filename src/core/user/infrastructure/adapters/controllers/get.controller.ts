import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../../auth/application/guards/jwt-auth.guard';
import { GetUserQuery } from '../../../../user/application/queries/get-user.query';
import { Roles } from '../../../../auth/application/decorators/roles.decorator';
import { RoleCode } from '../../../../role/domain/models/role.entity';
import { RolesGuard } from '../../../../auth/application/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';
import { GetUserControllerPort } from '../../../../user/domain/ports/controllers/get.controller';
import { User } from '../../../../user/domain/models/user.entity';

@ApiTags('Users Get Controller')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/users')
export class UserController implements GetUserControllerPort<number, User> {
  constructor(private readonly queryBus: QueryBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves user details by user ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Primary key of the user, it is a UUID string',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: User,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.READ_ONLY, RoleCode.REGULAR, RoleCode.ADMIN)
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(id));
  }
}
