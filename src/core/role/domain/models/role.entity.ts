import { User } from '../../../user/domain/models/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RoleCode {
  ADMIN = 'ADMIN',
  REGULAR = 'REGULAR',
  READ_ONLY = 'READ_ONLY',
}

@Entity({ schema: 'customers' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the role',
    example: '81b2c2d7-cd02-409c-86d4-372327dbe1b1',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: RoleCode,
    nullable: false,
  })
  @ApiProperty({
    description: 'Role code (e.g. ADMIN, REGULAR, READ_ONLY)',
    enum: RoleCode,
    example: RoleCode.ADMIN,
    nullable: false,
  })
  code: string;

  @OneToMany(() => User, (user) => user.role)
  @JoinColumn({ foreignKeyConstraintName: 'FK_role_user' })
  @ApiProperty({
    description: 'List of users assigned to this role',
    type: () => [User],
  })
  users: User[];
}
