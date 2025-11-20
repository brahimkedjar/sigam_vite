/*
  Warnings:

  - You are about to drop the column `id_statutJuridique` on the `detenteurmorale` table. All the data in the column will be lost.
  - The primary key for the `fonctionpersonnemoral` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "detenteurmorale" DROP CONSTRAINT "detenteurmorale_id_statutJuridique_fkey";

-- AlterTable
ALTER TABLE "detenteurmorale" DROP COLUMN "id_statutJuridique";

-- AlterTable
ALTER TABLE "fonctionpersonnemoral" DROP CONSTRAINT "fonctionpersonnemoral_pkey",
ADD COLUMN     "id_fonctionDetent" SERIAL NOT NULL,
ADD CONSTRAINT "fonctionpersonnemoral_pkey" PRIMARY KEY ("id_fonctionDetent");

-- CreateTable
CREATE TABLE "formejuridiquedetenteur" (
    "id_formeDetenteur" SERIAL NOT NULL,
    "id_statut" INTEGER NOT NULL,
    "id_detenteur" INTEGER NOT NULL,
    "date" TIMESTAMP(3),

    CONSTRAINT "formejuridiquedetenteur_pkey" PRIMARY KEY ("id_formeDetenteur")
);

-- AddForeignKey
ALTER TABLE "formejuridiquedetenteur" ADD CONSTRAINT "formejuridiquedetenteur_id_statut_fkey" FOREIGN KEY ("id_statut") REFERENCES "statutjuridique"("id_statutJuridique") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formejuridiquedetenteur" ADD CONSTRAINT "formejuridiquedetenteur_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE RESTRICT ON UPDATE CASCADE;
