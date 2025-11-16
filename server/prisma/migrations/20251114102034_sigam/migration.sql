/*
  Warnings:

  - You are about to drop the column `dureeEstimee` on the `phase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "phase" DROP COLUMN "dureeEstimee";

-- AlterTable
ALTER TABLE "relation_phase_typeprocedure" ADD COLUMN     "dureeEstimee" INTEGER;
