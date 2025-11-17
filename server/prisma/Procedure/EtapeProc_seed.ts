import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type etapeProcCSV = {
  id_etape: string;
  lib_etape: string;
  ordre_etape: string;
  id_phase: string;
  page_route?: string;
};

export async function main() {
  const etapeProcData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_EtapeProc.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: etapeProcCSV) => {
      etapeProcData.push({
        id_etape: Number(row.id_etape.trim()),
        id_phase: Number(row.id_phase.trim()),
        ordre_etape: Number(row.ordre_etape.trim()),
        lib_etape: row.lib_etape || null,
        page_route: row.page_route?.trim() || null,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.etapeProc.createMany({
          data: etapeProcData,
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
