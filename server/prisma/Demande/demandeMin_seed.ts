import * as fs from 'fs';
import * as csv from 'csv-parser';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();


export async function main() {
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_demandeMin.csv";
  let totalRows = 0;
  let skippedRows = 0;
  const skippedIds: number[] = [];

  const rows: Prisma.demandeMinCreateManyInput[] = [];

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on('data', (row: any) => {
      totalRows++;
      rows.push({
        id_demande: parseInt(row.id_demande, 10),
        min_label: row.min_label || null,
        min_teneur: parseFloat(row.min_teneur) || null,
        ordre_mineral: parseInt(row.ordre_mineral, 10) || null,
       
      });
    })
    .on('end', async () => {
      console.log(`CSV loaded: total rows = ${totalRows}`);

      for (const row of rows) {
        try {
          await prisma.demandeMin.create({ data: row });
        } catch (error: any) {
          console.warn(`⚠️ Skipped demande 'unknown'} due to error: ${error.message}`);
        }
      }

      console.log(`Insertion finished. ✅ Total skipped rows: ${skippedRows}`);
      if (skippedIds.length > 0) {
        console.log("IDs des demandes non insérées:", skippedIds.join(", "));
      }

      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
