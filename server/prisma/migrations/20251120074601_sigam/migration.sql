-- AlterTable
ALTER TABLE "personnephysique" ALTER COLUMN "id_personne" DROP DEFAULT;
DROP SEQUENCE "personnephysique_id_personne_seq";

-- AlterTable
ALTER TABLE "registrecommerce" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "registrecommerce_id_seq";
