import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';
import { AddPartyToEnterpriseCommand } from '../../../../enterprise/application/commands/add-party.command';
import { AddPartyToEnterpriseControllerPort } from '../../../../enterprise/domain/ports/controllers/create.controller';
import { AddPartyToEnterpriseDto } from '../../../../enterprise/shared/dto/add-party.dto';
import {
  Controller,
  Post,
  Param,
  Body,
  UseFilters,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Enterprise add Party Controller')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises/:enterpriseId/parties')
export class AddPartyToEnterpriseController
  implements AddPartyToEnterpriseControllerPort<AddPartyToEnterpriseDto, any>
{
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a party (user) to an enterprise',
    description:
      'This endpoint allows adding a user (party) to an enterprise with a specific role.',
  })
  @ApiParam({
    name: 'enterpriseId',
    description:
      'The ID of the enterprise to which the party (user) is being added',
    required: true,
    example: 'a123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    description:
      'Payload containing user ID and role to be assigned to the user within the enterprise',
    type: AddPartyToEnterpriseDto,
  })
  @Post()
  async addPartyToEnterprise(
    @Param('enterpriseId', ParseUUIDPipe) enterpriseId: string,
    @Body() dto: AddPartyToEnterpriseDto,
  ) {
    return this.commandBus.execute(
      new AddPartyToEnterpriseCommand(enterpriseId, dto.userId, dto.role),
    );
  }
}
