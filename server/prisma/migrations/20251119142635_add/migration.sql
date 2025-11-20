-- AlterTable
ALTER TABLE "demande" ADD COLUMN     "budget_prevu" DOUBLE PRECISION,
ADD COLUMN     "capital_social_disponible" DOUBLE PRECISION,
ADD COLUMN     "date_demarrage_prevue" TIMESTAMP(3),
ADD COLUMN     "description_travaux" TEXT,
ADD COLUMN     "duree_travaux_estimee" TEXT,
ADD COLUMN     "sources_financement" TEXT;
