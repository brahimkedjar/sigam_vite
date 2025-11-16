-- AlterTable
ALTER TABLE "typepermis" ADD COLUMN     "ref_legales" TEXT,
ALTER COLUMN "regime" DROP NOT NULL;
