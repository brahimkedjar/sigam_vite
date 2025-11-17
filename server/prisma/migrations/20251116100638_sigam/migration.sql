/*
  Warnings:

  - You are about to drop the column `id_detenteur` on the `demande` table. All the data in the column will be lost.
  - You are about to drop the column `id_typeProcedure` on the `relation_phase_typeprocedure` table. All the data in the column will be lost.
  - You are about to drop the `_PermisProcedure` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_combinaison` to the `relation_phase_typeprocedure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PermisProcedure" DROP CONSTRAINT "_PermisProcedure_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermisProcedure" DROP CONSTRAINT "_PermisProcedure_B_fkey";

-- DropForeignKey
ALTER TABLE "demande" DROP CONSTRAINT "demande_id_detenteur_fkey";

-- DropForeignKey
ALTER TABLE "relation_phase_typeprocedure" DROP CONSTRAINT "relation_phase_typeprocedure_id_typeProcedure_fkey";

-- AlterTable
ALTER TABLE "demande" DROP COLUMN "id_detenteur";

-- AlterTable
ALTER TABLE "procedure" ADD COLUMN     "cause_blocage" TEXT,
ADD COLUMN     "date_blocage" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "relation_phase_typeprocedure" DROP COLUMN "id_typeProcedure",
ADD COLUMN     "id_combinaison" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_PermisProcedure";

-- CreateTable
CREATE TABLE "combinaison_typepermis" (
    "id_combinaison" SERIAL NOT NULL,
    "id_typePermis" INTEGER NOT NULL,
    "id_proc" INTEGER NOT NULL,

    CONSTRAINT "combinaison_typepermis_pkey" PRIMARY KEY ("id_combinaison")
);

-- CreateTable
CREATE TABLE "procedure_phase_etapes" (
    "id_procPhaseEtape" SERIAL NOT NULL,
    "id_proc" INTEGER NOT NULL,
    "id_phase" INTEGER NOT NULL,
    "id_etape" INTEGER,
    "statut_etape" TEXT,
    "date_debut" TIMESTAMP(3),
    "date_fin" TIMESTAMP(3),
    "link" TEXT,

    CONSTRAINT "procedure_phase_etapes_pkey" PRIMARY KEY ("id_procPhaseEtape")
);

-- CreateTable
CREATE TABLE "permis_procedure" (
    "id_procedurePermis" SERIAL NOT NULL,
    "id_permis" INTEGER NOT NULL,
    "id_proc" INTEGER NOT NULL,

    CONSTRAINT "permis_procedure_pkey" PRIMARY KEY ("id_procedurePermis")
);

-- CreateTable
CREATE TABLE "detenteurDemande" (
    "id_detenteurDemande" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "id_detenteur" INTEGER NOT NULL,
    "role_detenteur" TEXT,

    CONSTRAINT "detenteurDemande_pkey" PRIMARY KEY ("id_detenteurDemande")
);

-- CreateIndex
CREATE UNIQUE INDEX "combinaison_typepermis_id_typePermis_id_proc_key" ON "combinaison_typepermis"("id_typePermis", "id_proc");

-- CreateIndex
CREATE UNIQUE INDEX "procedure_phase_etapes_id_proc_id_phase_id_etape_key" ON "procedure_phase_etapes"("id_proc", "id_phase", "id_etape");

-- CreateIndex
CREATE UNIQUE INDEX "permis_procedure_id_permis_id_proc_key" ON "permis_procedure"("id_permis", "id_proc");

-- AddForeignKey
ALTER TABLE "combinaison_typepermis" ADD CONSTRAINT "combinaison_typepermis_id_typePermis_fkey" FOREIGN KEY ("id_typePermis") REFERENCES "typepermis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combinaison_typepermis" ADD CONSTRAINT "combinaison_typepermis_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relation_phase_typeprocedure" ADD CONSTRAINT "relation_phase_typeprocedure_id_combinaison_fkey" FOREIGN KEY ("id_combinaison") REFERENCES "combinaison_typepermis"("id_combinaison") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_phase_etapes" ADD CONSTRAINT "procedure_phase_etapes_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_phase_etapes" ADD CONSTRAINT "procedure_phase_etapes_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_phase_etapes" ADD CONSTRAINT "procedure_phase_etapes_id_etape_fkey" FOREIGN KEY ("id_etape") REFERENCES "etape_proc"("id_etape") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis_procedure" ADD CONSTRAINT "permis_procedure_id_permis_fkey" FOREIGN KEY ("id_permis") REFERENCES "permis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permis_procedure" ADD CONSTRAINT "permis_procedure_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detenteurDemande" ADD CONSTRAINT "detenteurDemande_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detenteurDemande" ADD CONSTRAINT "detenteurDemande_id_detenteur_fkey" FOREIGN KEY ("id_detenteur") REFERENCES "detenteurmorale"("id_detenteur") ON DELETE RESTRICT ON UPDATE CASCADE;
