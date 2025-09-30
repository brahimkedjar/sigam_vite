/*
  Warnings:

  - The values [Payé,Annulé,Partiellement_payé] on the enum `EnumStatutPaiement` will be removed. If these variants are still used in the database, this will fail.
  - The values [Représentant,Représentant_Actionnaire] on the enum `EnumTypeFonction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nationalité` on the `personnephysique` table. All the data in the column will be lost.
  - Added the required column `nationalite` to the `personnephysique` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MissingAction" AS ENUM ('BLOCK_NEXT', 'REJECT', 'WARNING');

-- AlterEnum
BEGIN;
CREATE TYPE "EnumStatutPaiement_new" AS ENUM ('A_payer', 'Paye', 'En_retard', 'Annule', 'Partiellement_paye');
ALTER TABLE "obligationfiscale" ALTER COLUMN "statut" TYPE "EnumStatutPaiement_new" USING ("statut"::text::"EnumStatutPaiement_new");
ALTER TYPE "EnumStatutPaiement" RENAME TO "EnumStatutPaiement_old";
ALTER TYPE "EnumStatutPaiement_new" RENAME TO "EnumStatutPaiement";
DROP TYPE "EnumStatutPaiement_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EnumTypeFonction_new" AS ENUM ('Representant', 'Actionnaire', 'Representant_Actionnaire');
ALTER TABLE "fonctionpersonnemoral" ALTER COLUMN "type_fonction" TYPE "EnumTypeFonction_new" USING ("type_fonction"::text::"EnumTypeFonction_new");
ALTER TYPE "EnumTypeFonction" RENAME TO "EnumTypeFonction_old";
ALTER TYPE "EnumTypeFonction_new" RENAME TO "EnumTypeFonction";
DROP TYPE "EnumTypeFonction_old";
COMMIT;

-- AlterTable
ALTER TABLE "DossierDocument" ADD COLUMN     "is_obligatoire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "missing_action" "MissingAction" NOT NULL DEFAULT 'BLOCK_NEXT',
ADD COLUMN     "reject_message" TEXT;

-- AlterTable
ALTER TABLE "dossier_fournis" ADD COLUMN     "date_accuse" TIMESTAMP(3),
ADD COLUMN     "date_mise_en_demeure" TIMESTAMP(3),
ADD COLUMN     "date_preannotation" TIMESTAMP(3),
ADD COLUMN     "date_recepisse" TIMESTAMP(3),
ADD COLUMN     "mise_en_demeure_envoyee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "numero_accuse" TEXT,
ADD COLUMN     "numero_recepisse" TEXT,
ADD COLUMN     "pieces_manquantes" JSONB,
ADD COLUMN     "verification_phase" TEXT;

-- AlterTable
ALTER TABLE "personnephysique" DROP COLUMN "nationalité",
ADD COLUMN     "nationalite" TEXT NOT NULL;
