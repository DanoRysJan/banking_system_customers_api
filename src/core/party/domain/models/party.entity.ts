import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../../user/domain/models/user.entity';
import { Enterprise } from '../../../enterprise/domain/models/enterprise.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum RoleType {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

@Entity({ schema: 'customers' })
@Unique(['user', 'enterprise'])
export class Party {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the party',
    example: '81b2c2d7-cd02-409c-86d4-372327dbe1b1',
  })
  id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.EMPLOYEE,
    nullable: false,
  })
  @ApiProperty({
    description: 'Role of the party in the enterprise (ADMIN AND EMPLOYEE)',
    enum: RoleType,
    default: RoleType.EMPLOYEE,
    example: RoleType.ADMIN,
    nullable: false,
  })
  role: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({
    description: 'Date and time when the party was created',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({
    description: 'Date and time when the party was last updated',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @ApiProperty({
    description: 'Date and time when the party was deleted (soft delete)',
    example: '2025-02-25T00:00:00.000Z',
    nullable: true,
  })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.parties, { onDelete: 'CASCADE' })
  @JoinColumn({ foreignKeyConstraintName: 'FK_user_party' })
  @ApiProperty({
    description: 'User associated with the party',
    type: () => User,
  })
  user: User;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.parties, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'FK_enterprise_party' })
  @ApiProperty({
    description: 'Enterprise associated with the party',
    type: () => Enterprise,
  })
  enterprise: Enterprise;
}
