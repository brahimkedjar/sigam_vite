import * as fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SubstancesCSV = {
  id: string;
  nom_subFR: string;
  nom_subAR: string;
  categorie_sub: string;
  id_redevance: string;
};

export async function main() {
  const substancesData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_substances.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: SubstancesCSV) => {
      substancesData.push({
        id_sub: Number(row.id.trim()),
        nom_subFR: row.nom_subFR,
        nom_subAR: row.nom_subAR,
        categorie_sub: row.categorie_sub,
        id_redevance: Number(row.id_redevance.trim()),
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.substance.createMany({
          data: substancesData,
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


// métalliques, non-métalliques, radioactives