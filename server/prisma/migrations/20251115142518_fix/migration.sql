-- AlterTable
ALTER TABLE "demande" ADD COLUMN     "designation_number" TEXT,
ADD COLUMN     "id_sourceProc" INTEGER;

-- AddForeignKey
ALTER TABLE "demande" ADD CONSTRAINT "demande_id_sourceProc_fkey" FOREIGN KEY ("id_sourceProc") REFERENCES "procedure"("id_proc") ON DELETE SET NULL ON UPDATE CASCADE;
