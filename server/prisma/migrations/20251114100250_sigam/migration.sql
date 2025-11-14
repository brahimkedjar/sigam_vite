/*
  Warnings:

  - You are about to drop the column `typeProcedureId` on the `phase` table. All the data in the column will be lost.
  - You are about to drop the column `famille_sub` on the `substances` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "phase" DROP CONSTRAINT "phase_typeProcedureId_fkey";

-- DropForeignKey
ALTER TABLE "substances" DROP CONSTRAINT "substances_id_redevance_fkey";

-- AlterTable
ALTER TABLE "phase" DROP COLUMN "typeProcedureId";

-- AlterTable
ALTER TABLE "substances" DROP COLUMN "famille_sub",
ALTER COLUMN "nom_subFR" DROP NOT NULL,
ALTER COLUMN "nom_subAR" DROP NOT NULL,
ALTER COLUMN "categorie_sub" DROP NOT NULL,
ALTER COLUMN "id_redevance" DROP NOT NULL;

-- CreateTable
CREATE TABLE "relation_phase_typeprocedure" (
    "id_relation" SERIAL NOT NULL,
    "id_phase" INTEGER NOT NULL,
    "id_typeProcedure" INTEGER NOT NULL,

    CONSTRAINT "relation_phase_typeprocedure_pkey" PRIMARY KEY ("id_relation")
);

-- AddForeignKey
ALTER TABLE "relation_phase_typeprocedure" ADD CONSTRAINT "relation_phase_typeprocedure_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relation_phase_typeprocedure" ADD CONSTRAINT "relation_phase_typeprocedure_id_typeProcedure_fkey" FOREIGN KEY ("id_typeProcedure") REFERENCES "typeprocedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substances" ADD CONSTRAINT "substances_id_redevance_fkey" FOREIGN KEY ("id_redevance") REFERENCES "redevance_bareme"("id_redevance") ON DELETE SET NULL ON UPDATE CASCADE;
