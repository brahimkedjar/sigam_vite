-- DropForeignKey
ALTER TABLE "InteractionWali" DROP CONSTRAINT "InteractionWali_id_wilaya_fkey";

-- AlterTable
ALTER TABLE "InteractionWali" ALTER COLUMN "id_wilaya" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "InteractionWali" ADD CONSTRAINT "InteractionWali_id_wilaya_fkey" FOREIGN KEY ("id_wilaya") REFERENCES "Wilaya"("id_wilaya") ON DELETE SET NULL ON UPDATE CASCADE;
