import {
  Controller,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  UseFilters,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePartyCommand } from '../../../application/commands/update-party.command';
import { UpdatePartyControllerPort } from '../../../../enterprise/domain/ports/controllers/update.controller';
import { UpdatePartyDto } from '../../../../enterprise/shared/dto/update-party.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';

@ApiTags('Enterprise Update Party Controller')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises/:enterpriseId/parties/:partyId')
export class UpdatePartyController
  implements UpdatePartyControllerPort<UpdatePartyDto, any>
{
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update party role in an enterprise',
    description:
      'Updates the role of a party (user) within a specific enterprise.',
  })
  @ApiParam({
    name: 'enterpriseId',
    description: 'The ID of the enterprise where the party belongs',
    required: true,
    example: 'a123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'partyId',
    description: 'The ID of the party (user) whose role needs to be updated',
    required: true,
    example: 'f6556b8-3857-4ab8-acee-8d569b587007',
  })
  @ApiBody({
    description:
      'The data required to update the party’s role in the enterprise',
    type: UpdatePartyDto,
  })
  @ApiOkResponse({
    description: 'Party role updated successfully',
    type: String,
  })
  @Put()
  async updateParty(
    @Param('enterpriseId', ParseUUIDPipe) enterpriseId: string,
    @Param('partyId') partyId: string,
    @Body() dto: UpdatePartyDto,
  ) {
    return this.commandBus.execute(
      new UpdatePartyCommand(enterpriseId, partyId, dto.role),
    );
  }
}
