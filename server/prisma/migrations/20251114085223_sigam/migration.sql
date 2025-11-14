/*
  Warnings:

  - The primary key for the `demInitial` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_initial` on the `demInitial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "demAnnulation" ADD COLUMN     "permis_annule" BOOLEAN;

-- AlterTable
ALTER TABLE "demInitial" DROP CONSTRAINT "demInitial_pkey",
DROP COLUMN "id_initial",
ADD COLUMN     "id_demInitial" SERIAL NOT NULL,
ADD CONSTRAINT "demInitial_pkey" PRIMARY KEY ("id_demInitial");
