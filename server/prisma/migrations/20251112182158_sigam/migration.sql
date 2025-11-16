-- DropForeignKey
ALTER TABLE "typepermis" DROP CONSTRAINT "typepermis_id_taxe_fkey";

-- AlterTable
ALTER TABLE "typepermis" ALTER COLUMN "id_taxe" DROP NOT NULL,
ALTER COLUMN "lib_type" DROP NOT NULL,
ALTER COLUMN "code_type" DROP NOT NULL,
ALTER COLUMN "duree_initiale" DROP NOT NULL,
ALTER COLUMN "nbr_renouv_max" DROP NOT NULL,
ALTER COLUMN "duree_renouv" DROP NOT NULL,
ALTER COLUMN "delai_renouv" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "typepermis" ADD CONSTRAINT "typepermis_id_taxe_fkey" FOREIGN KEY ("id_taxe") REFERENCES "superficiaire_bareme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
