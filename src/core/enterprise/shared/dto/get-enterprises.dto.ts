import { IsInt, IsOptional, IsPositive, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EnterpriseType } from '../../domain/models/enterprise.entity';

export class GetEnterprisesDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsEnum(EnterpriseType, {
    message: 'Type must be either COMPANY or INDIVIDUAL',
  })
  type?: EnterpriseType;
}
