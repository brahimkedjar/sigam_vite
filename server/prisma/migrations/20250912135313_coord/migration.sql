/*
  Warnings:

  - You are about to drop the `Coordonnee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProcedureCoord" DROP CONSTRAINT "ProcedureCoord_id_coordonnees_fkey";

-- DropTable
DROP TABLE "Coordonnee";

-- CreateTable
CREATE TABLE "coordonnee" (
    "id_coordonnees" SERIAL NOT NULL,
    "id_zone_interdite" INTEGER,
    "point" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "system" TEXT DEFAULT 'WGS84',
    "zone" INTEGER,
    "hemisphere" TEXT,

    CONSTRAINT "coordonnee_pkey" PRIMARY KEY ("id_coordonnees")
);

-- AddForeignKey
ALTER TABLE "ProcedureCoord" ADD CONSTRAINT "ProcedureCoord_id_coordonnees_fkey" FOREIGN KEY ("id_coordonnees") REFERENCES "coordonnee"("id_coordonnees") ON DELETE RESTRICT ON UPDATE CASCADE;
