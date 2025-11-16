/*
  Warnings:

  - You are about to drop the column `id_proc` on the `combinaison_typepermis` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_typePermis,id_typeProc]` on the table `combinaison_typepermis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_typeProc` to the `combinaison_typepermis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "combinaison_typepermis" DROP CONSTRAINT "combinaison_typepermis_id_proc_fkey";

-- DropIndex
DROP INDEX "combinaison_typepermis_id_typePermis_id_proc_key";

-- AlterTable
ALTER TABLE "combinaison_typepermis" DROP COLUMN "id_proc",
ADD COLUMN     "id_typeProc" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "combinaison_typepermis_id_typePermis_id_typeProc_key" ON "combinaison_typepermis"("id_typePermis", "id_typeProc");

-- AddForeignKey
ALTER TABLE "combinaison_typepermis" ADD CONSTRAINT "combinaison_typepermis_id_typeProc_fkey" FOREIGN KEY ("id_typeProc") REFERENCES "typeprocedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
