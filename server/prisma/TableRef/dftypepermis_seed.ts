import * as fs from 'fs';
import * as csv from 'csv-parser';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type TypePermisCSV = {
  id_typePermis: string;
  id_taxe: string;
  lib_type: string;
  code_type: string;
  regime: string;
  duree_initiale: string;
  nbr_renouv_max: string;
  duree_renouv: string;
  delai_renouv: string;
  superficie_max: string;
  ref_légales: string;
};

export async function main() {
  const typePermisData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_Typepermis.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), // supprime BOM + espaces
      })
    )
    .on("data", (row: TypePermisCSV) => {
      typePermisData.push({
        id: Number(row.id_typePermis.trim()),
        id_taxe: row.id_taxe && Number(row.id_taxe) !== 0 ? Number(row.id_taxe) : null,
        lib_type: row.lib_type.trim(),
        code_type: row.code_type.trim(),
        regime: row.regime|| null,
        duree_initiale: parseFloat(row.duree_initiale.trim().replace(',', '.')),
        nbr_renouv_max: parseInt(row.nbr_renouv_max.trim().replace(',', '.')),
        duree_renouv: parseFloat(row.duree_renouv.trim().replace(',', '.')),
        delai_renouv: parseInt(row.delai_renouv.trim().replace(',', '.')),
        superficie_max: parseFloat(row.superficie_max.trim().replace(',', '.')),
        ref_legales: row.ref_légales || null,
      });
    })
    .on("end", async () => {
      console.log(`✅ CSV chargé (${typePermisData.length} lignes). Insertion...`);

      try {
        await prisma.typePermis.createMany({
          data: typePermisData,
          skipDuplicates: true,
        });
        console.log("🎉 Insertion terminée !");
      } catch (error) {
        console.error("❌ Erreur Prisma :", error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
