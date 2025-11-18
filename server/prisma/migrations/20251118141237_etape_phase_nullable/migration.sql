-- DropForeignKey
ALTER TABLE "etape_proc" DROP CONSTRAINT "etape_proc_id_phase_fkey";

-- AlterTable
ALTER TABLE "etape_proc" ALTER COLUMN "id_phase" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "etape_proc" ADD CONSTRAINT "etape_proc_id_phase_fkey" FOREIGN KEY ("id_phase") REFERENCES "phase"("id_phase") ON DELETE SET NULL ON UPDATE CASCADE;
