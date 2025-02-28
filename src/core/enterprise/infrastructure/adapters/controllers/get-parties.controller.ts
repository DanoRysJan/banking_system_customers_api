import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetEnterprisePartiesQuery } from '../../../application/queries/get-enterprise-parties.query';
import { GetEnterprisePartiesControllerPort } from '../../../../enterprise/domain/ports/controllers/get.controller';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../../common/infrastructure/filters/global-exception.filter';

@ApiTags('Enterprise Parties Controller')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises/:enterpriseId/parties')
export class GetEnterprisePartiesController
  implements GetEnterprisePartiesControllerPort<any>
{
  constructor(private readonly queryBus: QueryBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get parties of an enterprise',
    description:
      'Retrieves a paginated list of parties (users) associated with an enterprise',
  })
  @ApiParam({
    name: 'enterpriseId',
    description: 'The ID of the enterprise to fetch parties from',
    required: true,
    example: 'a123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit the number of parties returned per page',
    required: false,
    example: 10,
  })
  @Get()
  async getEnterpriseParties(
    @Param('enterpriseId', ParseUUIDPipe) enterpriseId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.queryBus.execute(
      new GetEnterprisePartiesQuery(enterpriseId, Number(page), Number(limit)),
    );
  }
}
