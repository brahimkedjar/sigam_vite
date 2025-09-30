-- AlterTable
ALTER TABLE "phase" ADD COLUMN     "typeProcedureId" INTEGER;

-- AddForeignKey
ALTER TABLE "phase" ADD CONSTRAINT "phase_typeProcedureId_fkey" FOREIGN KEY ("typeProcedureId") REFERENCES "typeprocedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;
