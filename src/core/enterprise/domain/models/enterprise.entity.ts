import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Address } from '../../../address/domain/models/address.entity';
import { Party } from '../../../party/domain/models/party.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../user/domain/models/user.entity';

export enum EnterpriseType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity({ schema: 'customers' })
export class Enterprise {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the enterprise',
    example: '81b2c2d7-cd02-409c-86d4-372327dbe1b1',
    nullable: false,
  })
  id: string;

  @Column({ type: 'enum', enum: EnterpriseType, nullable: false })
  @ApiProperty({
    description: 'Type of the enterprise (Individual or Company)',
    enum: EnterpriseType,
    example: EnterpriseType.COMPANY,
    nullable: false,
  })
  type: EnterpriseType;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    description: 'Legal business name of the enterprise',
    example: 'Tech Innovations LLC',
    nullable: false,
  })
  legalBusinessName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @ApiProperty({
    description:
      'Unique tax identification number (alphanumeric and 8-20 characters)',
    example: 'AB12345678',
    nullable: false,
    uniqueItems: true,
  })
  taxIdNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    description: 'Email address of the enterprise',
    example: 'contact@techinnovations.com',
  })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  @ApiProperty({
    description: 'Phone number of the enterprise',
    example: '+1234567890',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({
    description: 'Date and time when the enterprise was created',
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
    description: 'Date and time when the enterprise was last updated',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @ApiProperty({
    description: 'Date and time when the enterprise was deleted (soft delete)',
    example: '2025-02-25T00:00:00.000Z',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.enterprises)
  @JoinColumn({ foreignKeyConstraintName: 'FK_user_enterprise' })
  @ApiProperty({
    description: 'User assigned to the user',
    type: () => User,
  })
  user: User;

  @OneToMany(() => Address, (address) => address.enterprise)
  @JoinColumn({ foreignKeyConstraintName: 'FK_enterprise_address' })
  @ApiProperty({
    description: 'List of addresses associated with the enterprise',
    type: () => [Address],
  })
  addresses: Address[];

  @OneToMany(() => Party, (party) => party.enterprise)
  @JoinColumn({ foreignKeyConstraintName: 'FK_enterprise_party' })
  @ApiProperty({
    description: 'List of parties associated with the enterprise',
    type: () => [Party],
  })
  parties: Party[];
}
