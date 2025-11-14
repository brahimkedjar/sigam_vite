/*
  Warnings:

  - The `ordre_mineral` column on the `demandeMin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `demandeObs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "demandeObs" DROP CONSTRAINT "demandeObs_id_demande_fkey";

-- AlterTable
ALTER TABLE "demandeMin" DROP COLUMN "ordre_mineral",
ADD COLUMN     "ordre_mineral" INTEGER;

-- DropTable
DROP TABLE "demandeObs";
