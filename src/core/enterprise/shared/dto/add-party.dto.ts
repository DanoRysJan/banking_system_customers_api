import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../party/domain/models/party.entity';

export class AddPartyToEnterpriseDto {
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user to add as a party',
    example: '2a892357-f38d-4aae-aa1d-39b64834f398',
  })
  userId: string;

  @IsEnum(RoleType)
  @ApiProperty({
    description: 'Role of the user in the enterprise (ADMIN, EMPLOYEE)',
    enum: RoleType,
    example: RoleType.EMPLOYEE,
  })
  role: RoleType;
}
