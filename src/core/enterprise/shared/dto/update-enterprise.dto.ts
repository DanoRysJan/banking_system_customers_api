import { IsOptional, IsEnum, IsString, IsEmail, Length } from 'class-validator';
import { EnterpriseType } from '../../domain/models/enterprise.entity';

export class UpdateEnterpriseDto {
  @IsOptional()
  @IsEnum(EnterpriseType)
  type?: EnterpriseType;

  @IsOptional()
  @IsString()
  legalBusinessName?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20)
  taxIdNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;
}
