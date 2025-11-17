import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type combinaisonPermisProcCSV = {
  id_combinaison: string;
  id_typePermis: string;
  id_proc: string;
};

export async function main() {
  const combinaisonPermisProcData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_combinaisonPermisProc.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on("data", (row: combinaisonPermisProcCSV) => {
      combinaisonPermisProcData.push({
        id_combinaison: parseInt(row.id_combinaison?.trim() || '', 10),
        id_typePermis: parseInt(row.id_typePermis?.trim() || '', 10),
        id_typeProc: parseInt(row.id_proc?.trim() || '', 10),
            });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      const failedRows: any[] = [];

      // insertion ligne par ligne pour identifier les erreurs
      for (const row of combinaisonPermisProcData) {
        try {
          await prisma.combinaisonPermisProc.create({
            data: row,
          });
        } catch (error: any) {
          console.error("Error inserting row:", row);
          console.error("Error message:", error.message);
          failedRows.push({ row, error: error.message });
        }
      }

      if (failedRows.length > 0) {
        console.log(`Total rows failed: ${failedRows.length}`);
        fs.writeFileSync(
          "combinaisonPermisProc_failed_rows.json",
          JSON.stringify(failedRows, null, 2),
          "utf-8"
        );
        console.log("Failed rows saved to combinaisonPermisProc_failed_rows.json");
      } else {
        console.log("All rows inserted successfully!");
      }

      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
