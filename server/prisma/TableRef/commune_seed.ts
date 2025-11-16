import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Commune, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CommuneCSV = {
  id_commune: string;
  id_daira: string;
  nom_communeFR: string;
  nom_communeAR: string;
  nature: string;
};

export async function main() {
  const communeData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_commune.csv";

  fs.createReadStream(csvFilePath)
        .pipe(
            csv({
              separator: ';',
              mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), // supprime BOM + espaces
            })
          )
    .on("data", (row: CommuneCSV) => {
     
      communeData.push({
        id_commune: Number(row.id_commune.trim()),
        id_daira: row.id_daira ? Number(row.id_daira) : null,
        nom_communeFR: row.nom_communeFR,
        nom_communeAR: row.nom_communeAR,
        nature: row.nature,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.commune.createMany({
          data: communeData,
          skipDuplicates: true,
        });

        console.log("Seed finished.");
      } catch (error) {
        console.error("Error inserting data:", error);
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
