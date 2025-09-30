import * as fs from 'fs';
import * as csv from 'csv-parser';
import { ExpertMinier, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ExpertCSV = {
  id_expert: string;
  nom_expert: string;
};

export async function main() {
  const expertData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\cleaned_df\\df_expert.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: ExpertCSV) => {
      expertData.push({
        id_expert: Number(row.id_expert?.trim()),
        nom_expert: row.nom_expert,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.expertMinier.createMany({
          data: expertData,
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
