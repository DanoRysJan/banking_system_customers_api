import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../..//auth/application/guards/jwt-auth.guard';
import { Roles } from '../../../..//auth/application/decorators/roles.decorator';
import { RoleCode } from '../../../..//role/domain/models/role.entity';
import { RolesGuard } from '../../../..//auth/application/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { GlobalExceptionsFilter } from '../../../..//common/infrastructure/filters/global-exception.filter';
import { Enterprise } from '../../../..//enterprise/domain/models/enterprise.entity';
import { GetEnterpriseControllerPort } from '../../../..//enterprise/domain/ports/controllers/get.controller';
import { GetAllEnterprisesQuery } from '../../../..//enterprise/application/queries/get-enterprises.query';
import { GetEnterpriseByIdQuery } from '../../../..//enterprise/application/queries/get-enterprise-by-id.query';
import { Paginated } from '../../../..//common/domain/interfaces/pagination.interface';
import { GetEnterprisesDto } from '../../../..//enterprise/shared/dto/get-enterprises.dto';

@ApiTags('Enterprises')
@UseFilters(GlobalExceptionsFilter)
@Controller('v1/enterprises')
export class GetEnterpriseController
  implements
    GetEnterpriseControllerPort<
      GetEnterprisesDto,
      Enterprise,
      Paginated<Enterprise>
    >
{
  constructor(private readonly queryBus: QueryBus) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List all enterprises',
    description: 'Retrieves a paginated list of enterprises',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'type',
    description: 'Filter by enterprise type (company/individual)',
    required: false,
    example: 'company',
  })
  @ApiOkResponse({
    description: 'Enterprises retrieved successfully',
    type: [Enterprise],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.REGULAR, RoleCode.ADMIN)
  @Get()
  async findAll(
    @Query() params: GetEnterprisesDto,
  ): Promise<Paginated<Enterprise>> {
    const { page = 1, limit = 10, type } = params;
    return this.queryBus.execute(new GetAllEnterprisesQuery(page, limit, type));
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get enterprise details',
    description: 'Retrieves enterprise details by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Enterprise UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Enterprise retrieved successfully',
    type: Enterprise,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleCode.REGULAR, RoleCode.ADMIN)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Enterprise> {
    return this.queryBus.execute(new GetEnterpriseByIdQuery(id));
  }
}
