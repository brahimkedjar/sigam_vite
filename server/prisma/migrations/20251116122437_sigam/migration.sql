/*
  Warnings:

  - You are about to drop the column `AreaCat` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `budget_prevu` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `capital_social_disponible` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `con_res_exp` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `con_res_geo` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `date_demarrage_prevue` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `date_fin_ramassage` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `description_travaux` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `duree_travaux_estimee` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `intitule_projet` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `locPointOrigine` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `montant_produit` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `qualite_signataire` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `sources_financement` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `volume_prevu` on the `demande` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "demande" DROP COLUMN "AreaCat",
DROP COLUMN "budget_prevu",
DROP COLUMN "capital_social_disponible",
DROP COLUMN "con_res_exp",
DROP COLUMN "con_res_geo",
DROP COLUMN "date_demarrage_prevue",
DROP COLUMN "date_fin_ramassage",
DROP COLUMN "description_travaux",
DROP COLUMN "duree_travaux_estimee",
DROP COLUMN "intitule_projet",
DROP COLUMN "locPointOrigine",
DROP COLUMN "montant_produit",
DROP COLUMN "qualite_signataire",
DROP COLUMN "sources_financement",
DROP COLUMN "volume_prevu";
