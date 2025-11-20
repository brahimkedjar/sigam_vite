import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type procedurePermisCSV = {
  id_procedurePermis: string;
  id_proc: string;
  id_permis: string;


};

export async function main() {
  const procedurePermisData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_procedurePermis.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: procedurePermisCSV) => {
      procedurePermisData.push({
        id_procedurePermis: Number(row.id_procedurePermis.trim()),
        id_proc: Number(row.id_proc.trim()),
        id_permis: Number(row.id_permis.trim()),

      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.permisProcedure.createMany({
          data: procedurePermisData,
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
