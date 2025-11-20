/*
  Warnings:

  - You are about to drop the column `nationalite` on the `personnephysique` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "personnephysique" DROP COLUMN "nationalite",
ADD COLUMN     "siteWeb" TEXT,
ALTER COLUMN "lieu_naissance" DROP NOT NULL,
ALTER COLUMN "adresse_domicile" DROP NOT NULL,
ALTER COLUMN "telephone" DROP NOT NULL,
ALTER COLUMN "fax" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL;
