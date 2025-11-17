import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type substanceAssocieeDemandeCSV = {
  id_procsub: string;
  id_proc: string;
  id_sub: string;

};

export async function main() {
  const substanceAssocieeDemandeData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_substanceAssocieeDemande.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: substanceAssocieeDemandeCSV) => {
      substanceAssocieeDemandeData.push({
        id_procsub: Number(row.id_procsub.trim()),
        id_sub: Number(row.id_sub.trim()),
        id_proc: Number(row.id_proc.trim()),
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.substanceAssocieeDemande.createMany({
          data: substanceAssocieeDemandeData,
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
