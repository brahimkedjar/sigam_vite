import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();


function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr || dateStr === "None" || dateStr === "NaT" || dateStr.trim() === "") {
    console.log('Inside parseDate, invalid or empty input:', dateStr);
    return null;
  }

  console.log('Inside parseDate, input:', dateStr);

  let date: Date | null = null;

  // 1️⃣ Format DD/MM/YYYY HH:mm (with optional time)
  const dmMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (dmMatch) {
    const [, day, month, year, hour = "0", minute = "0"] = dmMatch;
    date = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    ));
  }

  // 2️⃣ Format YYYY-MM-DD HH:mm:ss (with optional seconds)
  const ymdMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!date && ymdMatch) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = ymdMatch;
    date = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));
  }

  // 3️⃣ Format YYYY-MM-DD (date only)
  if (!date) {
    const simpleMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (simpleMatch) {
      const [, year, month, day] = simpleMatch;
      date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
    }
  }

  // 4️⃣ Format ISO-8601 (e.g., 2025-10-07T14:30:00.000Z)
  if (!date) {
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3}Z)?$/);
    if (isoMatch) {
      const [, year, month, day, hour, minute, second] = isoMatch;
      date = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      ));
    }
  }

  if (!date || isNaN(date.getTime())) {
    console.warn('Failed to parse date:', dateStr);
    return null;
  }

  console.log('Inside parseDate, parsed:', date.toISOString());
  return date;
}

function parseId(value: string | undefined): number | null {
  const parsed = parseInt(value ?? "", 10);
  if (isNaN(parsed) || parsed === 0) return null;
  return parsed;
}

function parseBoolean(value: string | undefined): boolean | null {
  if (value === undefined || value === '' || value === null) return null;
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null;
}

export async function main() {
  const csvFilePath = "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_demAnnulation.csv";
  let totalRows = 0;
  let skippedRows = 0;
  const skippedIds: number[] = [];

  const rows: Prisma.demAnnulationCreateManyInput[] = [];

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
        id_annulation: parseInt(row.id_annulation, 10),
        id_demande: parseInt(row.id_demande, 10),
        origin_cadastre: parseBoolean(row.origin_cadastre),
        permis_annule: parseBoolean(row.permis_annule),
        date_vigueur: parseDate(row.date_vigueur) || null,
        DatePrepDocAnnulation: parseDate(row.DatePrepDocAnnulation) || null,
        verif_doc: row.verif_doc || null,
       
      });
    })
    .on('end', async () => {
      console.log(`CSV loaded: total rows = ${totalRows}`);

      for (const row of rows) {
        try {
          await prisma.demAnnulation.create({ data: row });
        } catch (error: any) {
          skippedRows++;
          if (row.id_annulation != null) {
            skippedIds.push(row.id_annulation);
          }
          console.warn(`⚠️ Skipped demande id=${row.id_annulation ?? 'unknown'} due to error: ${error.message}`);
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
