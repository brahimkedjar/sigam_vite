import * as fs from 'fs';
import * as csv from 'csv-parser';
import { demandeMin, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DemMinCSV = {
  id_demMin: string;
  id_demande: string;
  min_label: string;
  min_teneur: string;
  ordre_mineral: string;
};

export async function main() {
  const DemMinData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\cleaned_df\\df_demandeMin.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: DemMinCSV) => {
      DemMinData.push({
        id_demMin: Number(row.id_demMin?.trim()),
        id_demande: Number(row.id_demande),
        min_label: row.min_label,
        min_teneur: parseFloat(row.min_teneur),
        ordre_mineral: row.ordre_mineral
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.demandeMin.createMany({
          data: DemMinData,
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
