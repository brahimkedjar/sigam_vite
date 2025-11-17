import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type phasesCSV = {
  id_phase: string;
  libelle: string;
  ordre: string;
  description: string;

};

export async function main() {
  const phasesData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_phases.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: phasesCSV) => {
      phasesData.push({
        id_phase: Number(row.id_phase.trim()),
        ordre: Number(row.ordre.trim()),
        libelle: row.libelle || null,
        description: row.description || null,

      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.phase.createMany({
          data: phasesData,
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
