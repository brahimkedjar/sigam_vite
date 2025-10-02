-- AlterTable
ALTER TABLE "demandeVerificationGeo" ADD COLUMN     "superficie_cadastrale" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "inscription_provisoire" (
    "id" SERIAL NOT NULL,
    "id_proc" INTEGER NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "points" JSONB NOT NULL,
    "system" TEXT,
    "zone" INTEGER,
    "hemisphere" TEXT,
    "superficie_declaree" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inscription_provisoire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inscription_provisoire_id_proc_key" ON "inscription_provisoire"("id_proc");

-- CreateIndex
CREATE UNIQUE INDEX "inscription_provisoire_id_demande_key" ON "inscription_provisoire"("id_demande");

-- AddForeignKey
ALTER TABLE "inscription_provisoire" ADD CONSTRAINT "inscription_provisoire_id_proc_fkey" FOREIGN KEY ("id_proc") REFERENCES "procedure"("id_proc") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscription_provisoire" ADD CONSTRAINT "inscription_provisoire_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;
