import * as fs from 'fs';
import csv = require('csv-parser');
import { Daira, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DairaCSV = {
  id_daira: string;
  id_wilaya: string;
  nom_dairaFR: string;
  nom_dairaAR: string;
};

export async function main() {
  const dairaData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_daira.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), // supprime BOM + espaces
        })
      )
    .on("data", (row: DairaCSV) => {
      dairaData.push({
        id_daira: Number(row.id_daira?.trim()),
        id_wilaya: Number(row.id_wilaya),
        nom_dairaFR: row.nom_dairaFR,
        nom_dairaAR: row.nom_dairaAR,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.daira.createMany({
          data: dairaData,
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
