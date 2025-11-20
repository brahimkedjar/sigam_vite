-- DropForeignKey
ALTER TABLE "fonctionpersonnemoral" DROP CONSTRAINT "fonctionpersonnemoral_id_detenteur_fkey";

-- DropForeignKey
ALTER TABLE "fonctionpersonnemoral" DROP CONSTRAINT "fonctionpersonnemoral_id_personne_fkey";

-- AlterTable
ALTER TABLE "fonctionpersonnemoral" ALTER COLUMN "id_detenteur" DROP NOT NULL,
ALTER COLUMN "id_personne" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fonctionpersonnemoral" ADD CONSTRAINT "fonctionpersonnemoral_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fonctionpersonnemoral" ADD CONSTRAINT "fonctionpersonnemoral_id_personne_fkey" FOREIGN KEY ("id_personne") REFERENCES "personnephysique"("id_personne") ON DELETE SET NULL ON UPDATE CASCADE;
