import * as fs from 'fs';
import * as csv from 'csv-parser';
import { PrismaClient, Pays } from '@prisma/client';

const prisma = new PrismaClient();

type PaysCSV = {
  Pays: string;
  Nationalité: string;
  Code_pays: string;
};

export async function main() {
  const paysData: Omit<Pays, 'id_pays'>[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\cleaned_df\\pays_nationalites_codes.csv";

  fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ';' })) 
    .on('data', (row: PaysCSV) => {
      paysData.push({
        code_pays: row.Code_pays,
        nom_pays: row.Pays,
        nationalite: row.Nationalité,
      });
    })
    .on('end', async () => {
      console.log('CSV loaded, inserting into database...');

      for (const pays of paysData) {
        await prisma.pays.upsert({
          where: { code_pays: pays.code_pays },
          update: {},
          create: pays,
        });
      }

      console.log('Seed finished.');
      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
