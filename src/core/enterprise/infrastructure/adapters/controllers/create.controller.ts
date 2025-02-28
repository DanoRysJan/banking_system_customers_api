import { Controller, Post, Body, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../..//auth/application/guards/jwt-auth.guard';
import { Roles } from '../../../..//auth/application/decorators/roles.decorator';
import { RoleCode } from '../../../..//role/domain/models/role.entity';
import { RolesGuard } from '../../../..//auth/application/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../..//common/infrastructure/filters/global-exception.filter';
import { CreateEnterpriseCommand } from '../../../..//enterprise/application/commands/create-enterprise.command';
import { Enterprise } from '../../../..//enterprise/domain/models/enterprise.entity';
import { CreateEnterpriseControllerPort } from '../../../..//enterprise/domain/ports/controllers/create.controller';
import { CreateEnterpriseDto } from '../../../..//enterprise/shared/dto/create-enterprise.dto';
import { CurrentUser } from '../../../..//common/infrastructure/decorators/current-user';

@ApiTags('Enterprises')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises')
export class CreateEnterpriseController
  implements CreateEnterpriseControllerPort<CreateEnterpriseDto, Enterprise>
{
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new enterprise',
    description: 'Creates a new enterprise with tax ID validation',
  })
  @ApiCreatedResponse({
    description: 'Enterprise created successfully',
    type: Enterprise,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.REGULAR, RoleCode.ADMIN)
  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateEnterpriseDto,
  ): Promise<Enterprise> {
    dto.userId = user.id;
    return this.commandBus.execute(new CreateEnterpriseCommand(dto));
  }
}
