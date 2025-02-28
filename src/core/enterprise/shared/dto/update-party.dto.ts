import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../../../party/domain/models/party.entity';

export class UpdatePartyDto {
  @IsEnum(RoleType)
  @ApiProperty({
    description: 'New role of the party in the enterprise',
    enum: RoleType,
    example: RoleType.ADMIN,
  })
  role: RoleType;
}
