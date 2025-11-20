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
  const personnePhysiqueData: { data: Prisma.PersonnePhysiqueCreateInput; id_personne: number }[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_personnePhysique.csv";

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
      const id_personne = parseInt(row.id_personne, 10);
      const idPaysValue= row.Repr_PaysOrigine ? parseInt(row.Repr_PaysOrigine, 10) : null;

      const data: Prisma.PersonnePhysiqueCreateInput = {
        pays: { connect: { id_pays: parseId(row.id_pays)! } },
        nomFR: row.NomRepresentant || null,
        prenomFR: row.PrenomRepresentant || null,
        nomAR: row.nomAR || null,
        prenomAR: row.prenomAR || null,
        qualification: row.QualiteRepresentant || null,
        adresse_domicile: row.Repr_Adresse || null,
        telephone: row.Repr_Telephone || null,
        fax: row.Repr_Fax || null,
        email: row.Repr_Email || null,
        ref_professionnelles: row.réf_professionnelles || null,
        num_carte_identite: row.num_carte_identité || null,
        lieu_naissance: '',
        nationalite: '',
        lieu_juridique_soc: ''
      };
      personnePhysiqueData.push({ data, id_personne });

      console.log(`Ligne ${recordCount}: Données collectées pour id ${id_personne}`);
    })
    .on('end', async () => {
      console.log('CSV loaded, début des insertions...');

      for (let i = 0; i < personnePhysiqueData.length; i++) {
      for (let i = 0; i < personnePhysiqueData.length; i++) {
        try {
          await prisma.personnePhysique.create({ data: personnePhysiqueData[i].data });
          // console.log(`Ligne ${i + 1}: Insertion réussie pour id ${detenteurData[i].id}`);
          successCount++;
        } catch (error) {
          console.error(`Ligne ${i + 1}: Erreur lors de l'insertion pour id ${personnePhysiqueData[i].id_personne}:`, (error as Error).message);
          failedRecords.push({ line: i + 1, id: personnePhysiqueData[i].id_personne, error: (error as Error).message });
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
    }});
}

main().catch(async (e) => {
  console.error("Erreur globale:", e);
  await prisma.$disconnect();
  process.exit(1);
});