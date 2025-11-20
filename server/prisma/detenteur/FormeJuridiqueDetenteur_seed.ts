import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
  const FormeJuridiqueDetenteurData: Prisma.FormeJuridiqueDetenteurCreateManyInput[] = [];
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\SICMA\\Migration\\Final_CleanedDf\\df_formeJuridiqueDetenteur.csv";

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
      const id_formeDetenteur = parseInt(row.id_formeDetent, 10);
      const idStatut= row.id_statutJuridique ? parseInt(row.id_statutJuridique, 10) : null;
      const idDetenteur= row.id_detenteur ? parseInt(row.id_detenteur, 10) : null;

      const data: Prisma.FormeJuridiqueDetenteurCreateManyInput = {
        id_formeDetenteur,
        id_statut: parseId(row.id_statut)!,
        id_detenteur : parseId(row.id_detenteur)!,
        date: row.date || null,
      };
      FormeJuridiqueDetenteurData.push(data);

      console.log(`Ligne ${recordCount}: Données collectées pour id ${id_formeDetenteur}`);
    })
    .on('end', async () => {
      console.log('CSV loaded, début des insertions...');

      for (let i = 0; i < FormeJuridiqueDetenteurData.length; i++) {
        try {
          await prisma.formeJuridiqueDetenteur.create({ data: FormeJuridiqueDetenteurData[i] });
          // console.log(`Ligne ${i + 1}: Insertion réussie pour id ${detenteurData[i].id}`);
          successCount++;
        } catch (error) {
          console.error(`Ligne ${i + 1}: Erreur lors de l'insertion pour id ${FormeJuridiqueDetenteurData[i].id_formeDetenteur}:`, error.message);
          failedRecords.push({ line: i + 1, id: FormeJuridiqueDetenteurData[i].id_formeDetenteur!, error: error.message });
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