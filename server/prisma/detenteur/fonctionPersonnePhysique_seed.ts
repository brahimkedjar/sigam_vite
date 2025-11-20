import * as fs from 'fs';
const csv = require('csv-parser');
import { PrismaClient, Prisma,  } from '@prisma/client';

const prisma = new PrismaClient();
const csvFilePath = 'C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_fonctionpersonnePhysique.csv';

type FonctionRow = {
  id_fonctionDetent: number | null;
  id_personne: number | null;
  id_detenteur: number | null;
  type_fonction: string | null;
  taux_participation: number | null;
  statut_personne: string | null;
};

const parseNumber = (value: string | undefined): number | null => {
  if (!value) return null;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
};

async function main() {
  await prisma.$connect();

  const rows: FonctionRow[] = [];
  let total = 0;
  let success = 0;
  const failures: Array<{ line: number; reason: string }> = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ''),
        }),
      )
      .on('data', (row: any) => {
        total += 1;
        rows.push({
          id_fonctionDetent: parseNumber(row.id_fonctionDetent),
          id_personne: parseNumber(row.id_personne),
          id_detenteur: parseNumber(row.id_detenteur),
          type_fonction: row.type_fonction,
          taux_participation: parseNumber(row.taux_participation),
          statut_personne: row.statut_personne?.trim() || null,
        });
      })
      .on('end', () => resolve())
      .on('error', (error) => reject(error));
  });

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];

    if (!row.id_personne || !row.id_detenteur) {
      failures.push({
        line: index + 1,
        reason: `Identifiants manquants (personne: ${row.id_personne}, detenteur: ${row.id_detenteur})`,
      });
      continue;
    }

    const data: any = {
      type_fonction: row.type_fonction,
      taux_participation: row.taux_participation!,
      statut_personne: row.statut_personne!,
      personne: { connect: { id_personne: row.id_personne } },
      detenteur: { connect: { id_detenteur: row.id_detenteur } },
    };

    if (row.id_fonctionDetent) {
      data.id_fonctionDetent = row.id_fonctionDetent;
    }

    try {
      await prisma.fonctionPersonneMoral.create({ data });
      success += 1;
    } catch (error: any) {
      failures.push({
        line: index + 1,
        reason: error?.message ?? 'Erreur inconnue',
      });
    }
  }

  console.log(`Lignes CSV lues        : ${total}`);
  console.log(`Insertions réussies    : ${success}`);
  console.log(`Insertions en échec    : ${failures.length}`);


  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Erreur globale :', error);
  await prisma.$disconnect();
  process.exit(1);
});
