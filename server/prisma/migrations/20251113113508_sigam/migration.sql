-- AlterTable
ALTER TABLE "demande" ADD COLUMN     "LocPointOrigine" TEXT;

-- AlterTable
CREATE SEQUENCE typepermis_id_seq;
ALTER TABLE "typepermis" ALTER COLUMN "id" SET DEFAULT nextval('typepermis_id_seq');
ALTER SEQUENCE typepermis_id_seq OWNED BY "typepermis"."id";
