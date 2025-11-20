import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

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


export async function main() {
  await prisma.$connect(); 
  let recordCount = 0;
  let successCount = 0;
  const failedRecords: { line: number; id: number; error: string }[] = [];
  const registreCommerceData: {data:Prisma.RegistreCommerceCreateInput, id_registre: number }[] = [];
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\SICMA\\Migration\\Final_CleanedDf\\df_registreCommerce.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on('data', async (row: any) => {
      if (recordCount === 1) console.log("Colonnes CSV détectées :", Object.keys(row));

      recordCount++;
      const id_registre = parseInt(row.id_registre, 10);
      const idDetenetur= row.id_detenteur ? parseInt(row.id_detenteur, 10) : null;

      const data: Prisma.RegistreCommerceCreateInput = {
        detenteur: idDetenetur ? { connect: { id_detenteur: idDetenetur } } : undefined,
        nif: row.num_immat_fiscalNIF || null,
        numero_rc: row.num_rc || null,
        date_enregistrement: parseDate(row.date_rc),
        capital_social: row.capital_social || null,
        adresse_legale: row.adresse_legal || null,
        nis: row.num_ident_statistiqueNIS || null,
      };
      registreCommerceData.push({data,id_registre});

      console.log(`Ligne ${recordCount}: Données collectées pour id ${id_registre}`);
    })
    .on('end', async () => {
      console.log('CSV loaded, début des insertions...');

      for (let i = 0; i < registreCommerceData.length; i++) {
        try {
          await prisma.registreCommerce.create({ data: registreCommerceData[i].data });
          // console.log(`Ligne ${i + 1}: Insertion réussie pour id ${detenteurData[i].id}`);
          successCount++;
        } catch (error) {
          console.error(`Ligne ${i + 1}: Erreur lors de l'insertion pour id ${registreCommerceData[i].id_registre}:`, error.message);
          failedRecords.push({ line: i + 1, id: registreCommerceData[i].id_registre, error: error.message });
        }
      }

      console.log(`Total des lignes lues: ${recordCount}`);
      console.log(`Insertions réussies: ${successCount}`);
      console.log(`Échecs: ${recordCount - successCount}`);
      if (failedRecords.length > 0) {
        console.log('Lignes non insérées :');
        failedRecords.forEach((record) => {
          console.log(`- Ligne ${record.line}, ID ${record.id}: ${record.error}`);
        });
      }
      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error("Erreur globale:", e);
  await prisma.$disconnect();
  process.exit(1);
});
