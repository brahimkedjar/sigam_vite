-- DropForeignKey
ALTER TABLE "personnephysique" DROP CONSTRAINT "personnephysique_id_pays_fkey";

-- AlterTable
ALTER TABLE "personnephysique" ALTER COLUMN "id_pays" DROP NOT NULL,
ALTER COLUMN "nomAR" DROP NOT NULL,
ALTER COLUMN "prenomAR" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "personnephysique" ADD CONSTRAINT "personnephysique_id_pays_fkey" FOREIGN KEY ("id_pays") REFERENCES "pays"("id_pays") ON DELETE SET NULL ON UPDATE CASCADE;
