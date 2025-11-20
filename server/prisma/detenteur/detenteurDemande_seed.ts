import * as fs from 'fs';
const csv = require('csv-parser');
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

// Fonction utilitaire pour convertir une chaîne en booléen
function parseBoolean(value: string | undefined): boolean | null {
  if (value === undefined || value === '' || value === null) return null; // Retourne null si vide ou non défini
  const normalized = value.toLowerCase().trim();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null; 
}
function parseId(value: string | undefined): number | null {
  const parsed = parseInt(value ?? "", 10);
  if (isNaN(parsed) || parsed === 0) return null;
  return parsed;
}
export async function main() {
  await prisma.$connect(); 
  let recordCount = 0;
  let successCount = 0;
  const failedRecords: { line: number; id: number; error: string }[] = [];
  const detenteurDemandeData: Prisma.detenteurDemandeCreateManyInput[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_detenteurDemande.csv";

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
      const id_detenteurDemande = parseInt(row.id_detenteurDemande, 10);
      const id_demandeGeneral = row.id_demandeGeneral ? parseInt(row.id_demandeGeneral, 10) : null;
      const id_detenteur = row.id_detenteur ? parseInt(row.id_detenteur, 10) : null;

      const data: any = {
        id_detenteurDemande,
        id_demandeType: parseId(row.id_demandeType),
        demandeGeneral: id_demandeGeneral ? { connect: { id_demandeGeneral: id_demandeGeneral } } : undefined,
       detenteur: id_detenteur ? { connect: { id: id_detenteur } } : undefined,
        decision: row.decision || 'TRAITE',
      };
      detenteurDemandeData.push(data);

      console.log(`Ligne ${recordCount}: Données collectées pour id ${id_detenteurDemande}`);
      console.log("DEBUG id brut:", JSON.stringify(row.id));

    })
    .on('end', async () => {
      console.log('CSV loaded, début des insertions...');

      for (let i = 0; i < detenteurDemandeData.length; i++) {
        try {
          await prisma.detenteurDemande.create({ data: detenteurDemandeData[i] });
          // console.log(`Ligne ${i + 1}: Insertion réussie pour id ${detenteurData[i].id}`);
          successCount++;
        } catch (error) {
          console.error(`Ligne ${i + 1}: Erreur lors de l'insertion pour id ${detenteurDemandeData[i].id_detenteurDemande}:`, error.message);
          failedRecords.push({ line: i + 1, id: detenteurDemandeData[i].id_detenteurDemande!, error: error.message });
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
