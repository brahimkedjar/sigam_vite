import * as fs from 'fs';
import * as csv from 'csv-parser';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type relationPhaseTypeProcCSV = {
  id_phase: string;
  id_typeProc: string;
  dureeEstimee: string;

};

export async function main() {
  const relationPhaseTypeProcData: any[] = [];
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_relationPhaseTypeProc.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: relationPhaseTypeProcCSV) => {
      relationPhaseTypeProcData.push({
        id_phase: Number(row.id_phase.trim()),
        id_typeProcedure: Number(row.id_typeProc.trim()),
        dureeEstimee: parseInt(row.dureeEstimee) || null,
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
