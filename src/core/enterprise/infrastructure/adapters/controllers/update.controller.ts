import {
  Controller,
  Put,
  Param,
  Body,
  UseFilters,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../../auth/application/guards/jwt-auth.guard';
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
import { UpdateEnterpriseCommand } from '../../../../enterprise/application/commands/update-enterprise.command';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { UpdateEnterpriseControllerPort } from '../../../../enterprise/domain/ports/controllers/update.controller';
import { UpdateEnterpriseDto } from '../../../../enterprise/shared/dto/update-enterprise.dto';

@ApiTags('Enterprises')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises')
export class UpdateEnterpriseController
  implements
    UpdateEnterpriseControllerPort<string, UpdateEnterpriseDto, Enterprise>
{
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update enterprise',
    description: 'Updates an enterprise details',
  })
  @ApiParam({
    name: 'id',
    description: 'Enterprise UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Enterprise updated successfully',
    type: Enterprise,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.REGULAR)
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnterpriseDto,
  ): Promise<Enterprise> {
    return this.commandBus.execute(new UpdateEnterpriseCommand(id, dto));
  }
}
