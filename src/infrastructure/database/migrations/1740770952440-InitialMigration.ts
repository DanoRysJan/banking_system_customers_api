import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1740770952440 implements MigrationInterface {
  name = 'InitialMigration1740770952440';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "customers"."role_code_enum" AS ENUM('ADMIN', 'REGULAR', 'READ_ONLY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers"."role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" "customers"."role_code_enum" NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers"."address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "postalCode" character varying NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "enterpriseId" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "customers"."enterprise_type_enum" AS ENUM('individual', 'company')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers"."enterprise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "customers"."enterprise_type_enum" NOT NULL, "legalBusinessName" character varying(255) NOT NULL, "taxIdNumber" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, CONSTRAINT "UQ_3e632b1d1fcd3c0becc36be8585" UNIQUE ("taxIdNumber"), CONSTRAINT "PK_09687cd306dc5d486c0e227c471" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying(255) NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "roleId" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "customers"."party_role_enum" AS ENUM('admin', 'employee')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers"."party" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "customers"."party_role_enum" NOT NULL DEFAULT 'employee', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, "enterpriseId" uuid, CONSTRAINT "UQ_7fc608bccedbac7c027b349b3ae" UNIQUE ("userId", "enterpriseId"), CONSTRAINT "PK_e6189b3d533e140bb33a6d2cec1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."address" ADD CONSTRAINT "FK_enterprise_address" FOREIGN KEY ("enterpriseId") REFERENCES "customers"."enterprise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."enterprise" ADD CONSTRAINT "FK_user_enterprise" FOREIGN KEY ("userId") REFERENCES "customers"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."user" ADD CONSTRAINT "FK_role_user" FOREIGN KEY ("roleId") REFERENCES "customers"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."party" ADD CONSTRAINT "FK_user_party" FOREIGN KEY ("userId") REFERENCES "customers"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."party" ADD CONSTRAINT "FK_enterprise_party" FOREIGN KEY ("enterpriseId") REFERENCES "customers"."enterprise"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customers"."party" DROP CONSTRAINT "FK_enterprise_party"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."party" DROP CONSTRAINT "FK_user_party"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."user" DROP CONSTRAINT "FK_role_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."enterprise" DROP CONSTRAINT "FK_user_enterprise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers"."address" DROP CONSTRAINT "FK_enterprise_address"`,
    );
    await queryRunner.query(`DROP TABLE "customers"."party"`);
    await queryRunner.query(`DROP TYPE "customers"."party_role_enum"`);
    await queryRunner.query(`DROP TABLE "customers"."user"`);
    await queryRunner.query(`DROP TABLE "customers"."enterprise"`);
    await queryRunner.query(`DROP TYPE "customers"."enterprise_type_enum"`);
    await queryRunner.query(`DROP TABLE "customers"."address"`);
    await queryRunner.query(`DROP TABLE "customers"."role"`);
    await queryRunner.query(`DROP TYPE "customers"."role_code_enum"`);
  }
}
