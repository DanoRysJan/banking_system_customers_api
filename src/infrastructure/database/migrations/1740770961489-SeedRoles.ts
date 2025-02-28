import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1740770961489 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO customers.role (id, code) VALUES
            (uuid_generate_v4(), 'ADMIN'),
            (uuid_generate_v4(), 'REGULAR'),
            (uuid_generate_v4(), 'READ_ONLY');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM customers.role WHERE code IN ('ADMIN', 'REGULAR', 'READ_ONLY');`,
    );
  }
}
