import * as fs from 'fs';
import * as csv from 'csv-parser';
import { RegistreCommerce, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type RegistreCSV = {
  id_registre: string;
  id_detenteur: string;
  numero_rc: string;
  date_enregistrement: string;
  nif: string;
};

export async function main() {
  const RegistreData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\cleaned_df\\df_registre.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: RegistreCSV) => {
      RegistreData.push({
        id: Number(row.id_registre?.trim()),
        id_detenteur: Number(row.id_detenteur) === 0 ? null : Number(row.id_detenteur),
        numero_rc: row.numero_rc,
        date_enregistrement: row.date_enregistrement ? new Date(row.date_enregistrement) : null,
        nif: row.nif,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.registreCommerce.createMany({
          data: RegistreData,
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
