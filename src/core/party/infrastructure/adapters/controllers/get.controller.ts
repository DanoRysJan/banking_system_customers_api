import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Enterprise } from '../../../../enterprise/domain/models/enterprise.entity';
import { Paginated } from '../../../../common/domain/interfaces/pagination.interface';
import { GetEnterprisesByPartyIdControllerPort } from '../../../../party/domain/ports/controllers/get.controller';
import { GetEnterprisesByPartyIdQuery } from '../../../../party/application/queries/get-enterprises-by-party.query';
import { Roles } from '../../../../auth/application/decorators/roles.decorator';
import { RoleCode } from '../../../../role/domain/models/role.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('v1/parties')
@ApiTags('Parties')
export class GetEnterprisesByPartyIdController
  implements GetEnterprisesByPartyIdControllerPort<any>
{
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':partyId/enterprises')
  @Roles(RoleCode.REGULAR, RoleCode.ADMIN)
  @ApiOperation({ summary: 'Get enterprises by party ID' })
  @ApiParam({
    name: 'partyId',
    type: String,
    description: 'The ID of the party to get the enterprises for',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page for pagination',
    default: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of enterprises related to the party',
  })
  async getEnterprisesByPartyId(
    @Param('partyId') partyId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Paginated<Enterprise>> {
    return this.queryBus.execute(
      new GetEnterprisesByPartyIdQuery(partyId, Number(page), Number(limit)),
    );
  }
}
