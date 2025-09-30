import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { PrismaClient, Antenne } from '@prisma/client';

const prisma = new PrismaClient();

type AntenneCSV = {
  id_antenne: string;  
  nom: string;
  localisation: string;
};

export async function main() {
  const antenneData: Antenne[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\cleaned_df\\df_antenne.csv";

  // Check if file exists before trying to read it
  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    await prisma.$disconnect();
    process.exit(1);
  }

  // Check if file is readable
  try {
    fs.accessSync(csvFilePath, fs.constants.R_OK);
  } catch (error) {
    console.error(`Cannot read file: ${csvFilePath}`);
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv({ separator: ',' })) 
    .on('data', (row: AntenneCSV) => {
      console.log("ROW:", row);

      // Validate only the essential fields (id_antenne and nom)
      if (!row.id_antenne || !row.nom) {
        console.warn('Skipping row with missing required data:', row);
        return;
      }

      // Use empty string if localisation is missing or undefined
      const localisation = row.localisation || '';

      antenneData.push({
        id_antenne: Number(row.id_antenne),
        nom: row.nom,
        localisation: localisation,
      });
    })
    .on('end', async () => {
      console.log('CSV loaded, inserting into database...');
      console.log(`Found ${antenneData.length} records to insert`);

      if (antenneData.length === 0) {
        console.log('No data to insert');
        await prisma.$disconnect();
        return;
      }

      try {
        await prisma.antenne.createMany({
          data: antenneData,
          skipDuplicates: true, 
        });

        console.log(`Successfully inserted ${antenneData.length} antenne records`);
        console.log("Seed Antenne finished successfully");
      } catch (error) {
        console.error("Error inserting Antenne:", error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      prisma.$disconnect().then(() => process.exit(1));
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});