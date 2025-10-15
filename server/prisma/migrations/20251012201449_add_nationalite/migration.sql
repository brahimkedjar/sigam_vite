/*
  Warnings:

  - You are about to drop the column `id_pays` on the `demande` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "demande" DROP CONSTRAINT "demande_id_pays_fkey";

-- AlterTable
ALTER TABLE "demande" DROP COLUMN "id_pays";

-- AlterTable
ALTER TABLE "detenteurmorale" ADD COLUMN     "id_nationalite" INTEGER;

-- AlterTable
ALTER TABLE "personnephysique" ADD COLUMN     "id_nationalite" INTEGER;

-- CreateTable
CREATE TABLE "nationalite" (
    "id_nationalite" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "nationalite_pkey" PRIMARY KEY ("id_nationalite")
);

-- CreateIndex
CREATE UNIQUE INDEX "nationalite_libelle_key" ON "nationalite"("libelle");

-- AddForeignKey
ALTER TABLE "detenteurmorale" ADD CONSTRAINT "detenteurmorale_id_nationalite_fkey" FOREIGN KEY ("id_nationalite") REFERENCES "nationalite"("id_nationalite") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personnephysique" ADD CONSTRAINT "personnephysique_id_nationalite_fkey" FOREIGN KEY ("id_nationalite") REFERENCES "nationalite"("id_nationalite") ON DELETE SET NULL ON UPDATE CASCADE;
