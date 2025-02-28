import { Party } from '../../../party/domain/models/party.entity';
import { Role } from '../../../role/domain/models/role.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Enterprise } from '../../../enterprise/domain/models/enterprise.entity';

@Entity({ schema: 'customers' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '81b2c2d7-cd02-409c-86d4-372327dbe1b1',
  })
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  fullName: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  @ApiProperty({
    description: 'Username of the user (unique)',
    example: 'john_doe',
  })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @ApiProperty({
    description: 'Email address of the user (unique)',
    example: 'john.doe@example.com',
  })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  @ApiProperty({
    description: 'Phone number of the user (unique)',
    example: '+1234567890',
  })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    description: 'Password of the user (hashed)',
    example: 'hashed_password_example',
  })
  password: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  @ApiProperty({
    description: 'Date and time when the user was created',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  @ApiProperty({
    description: 'Date and time when the user was last updated',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @ApiProperty({
    description: 'Date and time when the user was deleted (soft delete)',
    example: '2025-02-25T00:00:00.000Z',
    nullable: true,
  })
  deletedAt?: Date;

  @OneToMany(() => Enterprise, (party) => party.user)
  @JoinColumn({ foreignKeyConstraintName: 'FK_user_enterprise' })
  @ApiProperty({
    description: 'List of enterprises associated with the user',
    type: () => [Enterprise],
  })
  enterprises: Enterprise[];

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ foreignKeyConstraintName: 'FK_role_user' })
  @ApiProperty({
    description: 'Role assigned to the user',
    type: () => Role,
  })
  role: Role;

  @OneToMany(() => Party, (party) => party.user)
  @JoinColumn({ foreignKeyConstraintName: 'FK_user_party' })
  @ApiProperty({
    description: 'List of parties associated with the user',
    type: () => [Party],
  })
  parties: Party[];
}
