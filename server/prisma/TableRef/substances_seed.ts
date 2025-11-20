import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SubstancesCSV = {
  id: string;
  nom_subFR: string;
  nom_subAR: string;
  categorie_sub: string;
  id_redevance: string;
};

export async function main() {
  const substancesData: any[] = [];
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_substances.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on("data", (row: SubstancesCSV) => {
      substancesData.push({
        id_sub: Number(row.id?.trim()),
        nom_subFR: row.nom_subFR,
        nom_subAR: row.nom_subAR,
        categorie_sub: row.categorie_sub,
          id_redevance: row.id_redevance && row.id_redevance.trim() !== '' 
                ? Number(row.id_redevance.trim()) 
                : null,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      const failedRows: any[] = [];

      // insertion ligne par ligne pour identifier les erreurs
      for (const row of substancesData) {
        try {
          await prisma.substance.create({
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
          "substances_failed_rows.json",
          JSON.stringify(failedRows, null, 2),
          "utf-8"
        );
        console.log("Failed rows saved to substances_failed_rows.json");
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
