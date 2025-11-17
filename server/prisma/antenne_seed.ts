import * as fs from 'fs';
import * as path from 'path';
import csv = require('csv-parser');
import { PrismaClient, Antenne } from '@prisma/client';

const prisma = new PrismaClient();

type AntenneCSV = {
  id_antenne: string;  
  nom: string;
  localisation: string;
  Email: string;
  Telephone: string;
  Responsable: string;
};

export async function main() {
  const antenneData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_antenne.csv";

  fs.createReadStream(csvFilePath)
        .pipe(
            csv({
              separator: ';',
              mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), // supprime BOM + espaces
            })
          )
    .on("data", (row: AntenneCSV) => {
     
      antenneData.push({
        id_antenne: Number(row.id_antenne.trim()),
        nom: row.nom,
        localisation: row.localisation,
        Email: row.Email,
        Telephone: row.Telephone,
        Responsable: row.Responsable,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.antenne.createMany({
          data: antenneData,
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