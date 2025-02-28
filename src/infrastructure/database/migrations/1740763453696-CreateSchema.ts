import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1740763453696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS customers;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS customers CASCADE;`);
  }
}
