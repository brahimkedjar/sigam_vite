import * as fs from 'fs';
import * as csv from 'csv-parser';
import { TypeProcedure, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type typeProcedureCSV = {
  id_typeProc: string;
  libelle_type: string;
  description: string;
};

export async function main() {
  const typeProcedureData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_typeProcedures.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: typeProcedureCSV) => {
      typeProcedureData.push({
        id: Number(row.id_typeProc.trim()),
        libelle: row.libelle_type || null,
        description: row.description || null,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.typeProcedure.createMany({
          data: typeProcedureData,
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
