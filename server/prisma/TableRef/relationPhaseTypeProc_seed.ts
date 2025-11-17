import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type relationPhaseTypeProcCSV = {
  id_phase: string;
  id_combinaison: string;
  dureeEstimee: string;
};

export async function main() {
  const relationPhaseTypeProcData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_relationPhaseTypeProc.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on("data", (row: relationPhaseTypeProcCSV) => {
      const id_combinaison = row.id_combinaison?.trim();
      
      // ignorer si id_combinaison est vide ou null
      if (!id_combinaison) return;

      relationPhaseTypeProcData.push({
        id_phase: Number(row.id_phase.trim()),
        id_combinaison: Number(id_combinaison),
        dureeEstimee: Number(row.dureeEstimee.trim()),
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.relationPhaseTypeProc.createMany({
          data: relationPhaseTypeProcData,
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
