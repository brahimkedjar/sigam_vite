/*
  Warnings:

  - You are about to drop the column `status` on the `detenteurmorale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "detenteurmorale" DROP COLUMN "status";

-- AlterTable
CREATE SEQUENCE personnephysique_id_personne_seq;
ALTER TABLE "personnephysique" ALTER COLUMN "id_personne" SET DEFAULT nextval('personnephysique_id_personne_seq');
ALTER SEQUENCE personnephysique_id_personne_seq OWNED BY "personnephysique"."id_personne";

-- AlterTable
CREATE SEQUENCE registrecommerce_id_seq;
ALTER TABLE "registrecommerce" ALTER COLUMN "id" SET DEFAULT nextval('registrecommerce_id_seq');
ALTER SEQUENCE registrecommerce_id_seq OWNED BY "registrecommerce"."id";
