/*
  Warnings:

  - You are about to drop the column `cause_annulation` on the `demAnnulation` table. All the data in the column will be lost.
  - You are about to drop the column `date_annulation` on the `demAnnulation` table. All the data in the column will be lost.
  - You are about to drop the column `date_constat` on the `demAnnulation` table. All the data in the column will be lost.
  - You are about to drop the column `num_decision` on the `demAnnulation` table. All the data in the column will be lost.
  - You are about to drop the column `statut_modification` on the `demModification` table. All the data in the column will be lost.
  - You are about to drop the column `type_modif` on the `demModification` table. All the data in the column will be lost.
  - You are about to drop the column `motif_renonciation` on the `demRenonciation` table. All the data in the column will be lost.
  - You are about to drop the column `rapport_technique` on the `demRenonciation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProcedureRenouvellement" ADD COLUMN     "ConResExp" DOUBLE PRECISION,
ADD COLUMN     "ConResGeo" DOUBLE PRECISION,
ADD COLUMN     "VolumePrevu" DOUBLE PRECISION,
ADD COLUMN     "date_demarrage_prevue" TIMESTAMP(3),
ADD COLUMN     "dossier_complet" BOOLEAN,
ADD COLUMN     "dossier_recevable" BOOLEAN,
ADD COLUMN     "duree_trvx" INTEGER,
ADD COLUMN     "inscripProv" BOOLEAN,
ADD COLUMN     "obs_attestation" TEXT,
ADD COLUMN     "obs_empiet" TEXT,
ADD COLUMN     "obs_emplacement" TEXT,
ADD COLUMN     "obs_geom" TEXT,
ADD COLUMN     "obs_sit_geo" TEXT,
ADD COLUMN     "obs_superficie" TEXT,
ADD COLUMN     "qualite_signataire" TEXT,
ADD COLUMN     "rec_enquete_date" TIMESTAMP(3),
ADD COLUMN     "rec_enquete_nomRespon" TEXT;

-- AlterTable
ALTER TABLE "demAnnulation" DROP COLUMN "cause_annulation",
DROP COLUMN "date_annulation",
DROP COLUMN "date_constat",
DROP COLUMN "num_decision",
ADD COLUMN     "DatePrepDocAnnulation" TIMESTAMP(3),
ADD COLUMN     "date_vigueur" TIMESTAMP(3),
ADD COLUMN     "origin_cadastre" BOOLEAN,
ADD COLUMN     "verif_doc" TEXT;

-- AlterTable
ALTER TABLE "demModification" DROP COLUMN "statut_modification",
DROP COLUMN "type_modif",
ADD COLUMN     "ConResExp" DOUBLE PRECISION,
ADD COLUMN     "ConResGeo" DOUBLE PRECISION,
ADD COLUMN     "VolumePrevu" DOUBLE PRECISION,
ADD COLUMN     "date_demarrage_prevue" TIMESTAMP(3),
ADD COLUMN     "dossier_complet" BOOLEAN,
ADD COLUMN     "dossier_recevable" BOOLEAN,
ADD COLUMN     "duree_trvx" INTEGER,
ADD COLUMN     "idDivisionEnCurso" INTEGER,
ADD COLUMN     "inscripProv" BOOLEAN,
ADD COLUMN     "intitule_projet" TEXT,
ADD COLUMN     "montant_produit" DOUBLE PRECISION,
ADD COLUMN     "obs_attestation" TEXT,
ADD COLUMN     "obs_empiet" TEXT,
ADD COLUMN     "obs_emplacement" TEXT,
ADD COLUMN     "obs_geom" TEXT,
ADD COLUMN     "obs_sit_geo" TEXT,
ADD COLUMN     "obs_superficie" TEXT,
ADD COLUMN     "qualite_signataire" TEXT,
ADD COLUMN     "rec_enquete_date" TIMESTAMP(3),
ADD COLUMN     "rec_enquete_nomRespon" TEXT,
ADD COLUMN     "type_modification" TEXT;

-- AlterTable
ALTER TABLE "demRenonciation" DROP COLUMN "motif_renonciation",
DROP COLUMN "rapport_technique",
ADD COLUMN     "RenonOct" BOOLEAN;

-- AlterTable
ALTER TABLE "demTransfert" ADD COLUMN     "dossier_octroyable" BOOLEAN,
ADD COLUMN     "transfer_obtenu" BOOLEAN;

-- CreateTable
CREATE TABLE "demInitial" (
    "id_initial" SERIAL NOT NULL,
    "id_demande" INTEGER NOT NULL,
    "duree_trvx" INTEGER,
    "qualite_signataire" TEXT,
    "date_demarrage_prevue" TIMESTAMP(3),
    "dossier_recevable" BOOLEAN,
    "dossier_complet" BOOLEAN,
    "rec_enquete_date" TIMESTAMP(3),
    "rec_enquete_nomRespon" TEXT,
    "obs_attestation" TEXT,
    "ConResGeo" DOUBLE PRECISION,
    "ConResExp" DOUBLE PRECISION,
    "VolumePrevu" DOUBLE PRECISION,
    "obs_sit_geo" TEXT,
    "obs_empiet" TEXT,
    "obs_emplacement" TEXT,
    "obs_geom" TEXT,
    "obs_superficie" TEXT,
    "inscripProv" BOOLEAN,
    "intitule_projet" TEXT,
    "montant_produit" DOUBLE PRECISION,

    CONSTRAINT "demInitial_pkey" PRIMARY KEY ("id_initial")
);

-- CreateIndex
CREATE UNIQUE INDEX "demInitial_id_demande_key" ON "demInitial"("id_demande");

-- AddForeignKey
ALTER TABLE "demInitial" ADD CONSTRAINT "demInitial_id_demande_fkey" FOREIGN KEY ("id_demande") REFERENCES "demande"("id_demande") ON DELETE RESTRICT ON UPDATE CASCADE;
