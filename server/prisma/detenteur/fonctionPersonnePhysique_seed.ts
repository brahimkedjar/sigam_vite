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
  const fonctionPersonnePhysiqueData: Prisma.FonctionPersonneMoralCreateManyInput[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_fonctiopersonnePhysique.csv";

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
      const id_fonctionDetent = parseInt(row.id_fonction, 10);
      const idPersonne= row.id_personne ? parseInt(row.id_personne, 10) : null;
      const idDetenteur= row.id_detenteur ? parseInt(row.id_detenteur, 10) : null;

      const data: Prisma.FonctionPersonneMoralCreateManyInput = {
        id_fonctionDetent,
        id_personne: idPersonne || 0,
        id_detenteur: idDetenteur || 0,
        type_fonction: row.type_fonction || null,
        taux_participation: row.taux_participation || null,
        statut_personne: row.statut_personne || null,
      };
      fonctionPersonnePhysiqueData.push(data);

      console.log(`Ligne ${recordCount}: Données collectées pour id ${id_fonctionDetent}`);
    })
    .on('end', async () => {
      console.log('CSV loaded, début des insertions...');

      for (let i = 0; i < fonctionPersonnePhysiqueData.length; i++) {
        try {
          await prisma.fonctionPersonneMoral.create({ data: fonctionPersonnePhysiqueData[i] });
          // console.log(`Ligne ${i + 1}: Insertion réussie pour id ${detenteurData[i].id}`);
          successCount++;
        } catch (error) {
          console.error(`Ligne ${i + 1}: Erreur lors de l'insertion pour id ${fonctionPersonnePhysiqueData[i].id_fonctionDetent}:`, error.message);
          failedRecords.push({ line: i + 1, id: fonctionPersonnePhysiqueData[i].id_fonctionDetent!, error: error.message });
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