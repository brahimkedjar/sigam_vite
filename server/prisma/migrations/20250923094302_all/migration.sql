/*
  Warnings:

  - You are about to drop the column `id_paiement` on the `TsPaiement` table. All the data in the column will be lost.
  - You are about to drop the `Procedure` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_obligation` to the `TsPaiement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InteractionWali" DROP CONSTRAINT "InteractionWali_id_procedure_fkey";

-- DropForeignKey
ALTER TABLE "Procedure" DROP CONSTRAINT "Procedure_id_seance_fkey";

-- DropForeignKey
ALTER TABLE "ProcedureCoord" DROP CONSTRAINT "ProcedureCoord_id_proc_fkey";

-- DropForeignKey
ALTER TABLE "TsPaiement" DROP CONSTRAINT "TsPaiement_id_paiement_fkey";

-- DropForeignKey
ALTER TABLE "_PermisProcedure" DROP CONSTRAINT "_PermisProcedure_B_fkey";

-- DropForeignKey
ALTER TABLE "demande" DROP CONSTRAINT "demande_id_proc_fkey";

-- DropForeignKey
ALTER TABLE "procedure_etape" DROP CONSTRAINT "procedure_etape_id_proc_fkey";

-- DropForeignKey
ALTER TABLE "procedure_phase" DROP CONSTRAINT "procedure_phase_id_proc_fkey";

-- DropForeignKey
ALTER TABLE "substance_associee_demande" DROP CONSTRAINT "substance_associee_demande_id_proc_fkey";

-- AlterTable
ALTER TABLE "InteractionWali" ALTER COLUMN "date_envoi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TsPaiement" DROP COLUMN "id_paiement",
ADD COLUMN     "id_obligation" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "coordonnee" ALTER COLUMN "point" DROP NOT NULL;

-- AlterTable
ALTER TABLE "personnephysique" ALTER COLUMN "date_naissance" DROP NOT NULL;

-- DropTable
DROP TABLE "Procedure";

-- CreateTable
CREATE TABLE "procedure" (
    "id_proc" SERIAL NOT NULL,
    "id_seance" INTEGER,
    "num_proc" TEXT NOT NULL,
    "date_debut_proc" TIMESTAMP(3) NOT NULL,
    "date_fin_proc" TIMESTAMP(3),
    "statut_proc" "StatutProcedure" NOT NULL,
    "resultat" TEXT,
    "observations" TEXT,
    "typeProcedureId" INTEGER,

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("id_proc")
);

-- CreateIndex
CREATE UNIQUE INDEX "procedure_num_proc_key" ON "procedure"("num_proc");

-- AddForeignKey
ALTER TABLE "procedure_phase" ADD CONSTRAINT "procedure_phase_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_etape" ADD CONSTRAINT "procedure_etape_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_id_seance_fkey" FOREIGN KEY ("id_seance") REFERENCES "SeanceCDPrevue"("id_seance") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionWali" ADD CONSTRAINT "InteractionWali_id_procedure_fkey" FOREIGN KEY ("id_procedure") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substance_associee_demande" ADD CONSTRAINT "substance_associee_demande_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcedureCoord" ADD CONSTRAINT "ProcedureCoord_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TsPaiement" ADD CONSTRAINT "TsPaiement_id_obligation_fkey" FOREIGN KEY ("id_obligation") REFERENCES "obligationfiscale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermisProcedure" ADD CONSTRAINT "_PermisProcedure_B_fkey" FOREIGN KEY ("B") REFERENCES "procedure"("id_proc") ON DELETE CASCADE ON UPDATE CASCADE;
