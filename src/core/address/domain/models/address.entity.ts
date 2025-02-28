import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Enterprise } from '../../../enterprise/domain/models/enterprise.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'customers' })
export class Address {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier of the address',
    example: '81b2c2d7-cd02-409c-86d4-372327dbe1b1',
    nullable: false,
  })
  id: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Street name and number',
    example: 'Av. Insurgentes Sur 1234',
    nullable: false,
  })
  street: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'City of the address',
    example: 'Mexico City',
    nullable: false,
  })
  city: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'State of the address (Mexican postal code format)',
    example: 'CDMX',
    nullable: false,
  })
  state: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Postal code of the address',
    example: '03910',
    nullable: false,
  })
  postalCode: string;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Country of the address',
    example: 'Mexico',
    nullable: false,
  })
  country: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  @ApiProperty({
    description: 'Date and time when the address was created',
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
    description: 'Date and time when the address was last updated',
    example: '2025-02-25T00:00:00.000Z',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @ApiProperty({
    description: 'Date and time when the address was deleted (soft delete)',
    example: '2025-02-25T00:00:00.000Z',
    nullable: true,
  })
  deletedAt?: Date;

  @ManyToOne(() => Enterprise, (enterprise) => enterprise.addresses)
  @JoinColumn({ foreignKeyConstraintName: 'FK_enterprise_address' })
  @ApiProperty({
    description: 'The enterprise associated with the address',
    type: () => Enterprise,
  })
  enterprise: Enterprise;
}
