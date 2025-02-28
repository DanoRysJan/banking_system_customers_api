import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsOptional,
  Matches,
} from 'class-validator';
import { EnterpriseType } from '../../domain/models/enterprise.entity';

export class CreateEnterpriseDto {
  @IsEnum(EnterpriseType)
  type: EnterpriseType;

  @IsString()
  @IsNotEmpty()
  legalBusinessName: string;

  @IsString()
  @Length(12, 13)
  @IsNotEmpty()
  @Matches(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2,3}$/, {
    message: 'The tax ID number must be in the format of a Mexican RFC.',
  })
  taxIdNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(10, 20)
  phone: string;

  @IsString()
  @IsOptional()
  userId: string;
}
