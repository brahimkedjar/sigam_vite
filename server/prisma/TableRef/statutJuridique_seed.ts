import * as fs from 'fs';
import csv = require('csv-parser');
import { StatutJuridique, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type StatutCSV = {
  id_statutJuridique: string;
  code_statut: string;
  statut_ar: string;
  statut_fr: string;
};

export async function main() {
  const statutData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_statut.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: StatutCSV) => {
      statutData.push({
        id_statutJuridique: Number(row.id_statutJuridique.trim()),
        code_statut: row.code_statut,
        statut_ar: row.statut_ar,
        statut_fr: row.statut_fr,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.statutJuridique.createMany({
          data: statutData,
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
