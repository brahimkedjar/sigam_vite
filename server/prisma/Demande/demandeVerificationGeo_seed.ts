import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function parseBoolean(value: string | undefined): boolean | null {
  if (value === undefined || value === '' || value === null) return null;
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null;
}

export async function main() {
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_demandeVerificationGeo.csv";
  let totalRows = 0;
  let skippedRows = 0;
  const skippedIds: number[] = [];

  const rows: Prisma.demandeVerificationGeoCreateManyInput[] = [];

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
        sit_geo_ok: parseBoolean(row.sit_geo_ok),
        empiet_ok: parseBoolean(row.empiet_ok),
        superf_ok: parseBoolean(row.superf_ok),
        geom_ok: parseBoolean(row.geom_ok),
        verification_cadastrale_ok: parseBoolean(row.verification_cadastrale_ok),
        superficie_cadastrale: parseFloat(row.superficie_cadastrale) || null,
      });
    })
    .on('end', async () => {
      console.log(`CSV loaded: total rows = ${totalRows}`);

      for (const row of rows) {
        try {
          await prisma.demandeVerificationGeo.create({ data: row });
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
