import {
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';
import { DeleteEnterpriseCommand } from '../../../../enterprise/application/commands/delete-enterprise.command';
import { DeleteEnterpriseControllerPort } from '../../../../enterprise/domain/ports/controllers/delete.controller';
import { AppResponse } from '../../../../common/infrastructure/models/api.response';

@ApiTags('Enterprises')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises')
export class DeleteEnterpriseController
  implements DeleteEnterpriseControllerPort<string, AppResponse<null>>
{
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete enterprise',
    description: 'Soft deletes an enterprise and associated parties',
  })
  @ApiParam({
    name: 'id',
    description: 'Enterprise UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({ description: 'Enterprise deleted successfully' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.REGULAR)
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AppResponse<null>> {
    return this.commandBus.execute(new DeleteEnterpriseCommand(id));
  }
}
