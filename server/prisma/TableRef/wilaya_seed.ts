import * as fs from 'fs';
import csv = require('csv-parser');
import {  PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type WilayaCSV = {
  id_wilaya: string;
  id_antenne: string; // Changed to string since CSV values are strings
  code_wilaya: string;
  nom_wilayaFR: string;
  nom_wilayaAR: string;
  zone: string;
};

export async function main() {
  const wilayaData: any[] = [];
  const csvFilePath = "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_wilaya.csv";

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
    .pipe(
      csv({
        separator: ';',
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), // supprime BOM + espaces
      })
    )
    .on('data', (row: WilayaCSV) => {
      console.log("ROW:", row);

      // Validate required fields
      if (!row.id_wilaya || !row.id_antenne || !row.code_wilaya || !row.nom_wilayaFR) {
        console.warn('Skipping row with missing required data:', row);
        return;
      }

      // Handle optional fields with defaults
      const nom_wilayaAR = row.nom_wilayaAR || '';
      const zone = row.zone || '';

      wilayaData.push({
        id_wilaya: Number(row.id_wilaya.trim()),
        id_antenne: Number(row.id_antenne),
        code_wilaya: row.code_wilaya,
        nom_wilayaFR: row.nom_wilayaFR,
        nom_wilayaAR: nom_wilayaAR,
        zone: zone,
      });
    })
    .on('end', async () => {
      console.log('CSV loaded, inserting into database...');
      console.log(`Found ${wilayaData.length} records to insert`);

      if (wilayaData.length === 0) {
        console.log('No data to insert');
        await prisma.$disconnect();
        return;
      }

      try {
        await prisma.wilaya.createMany({
          data: wilayaData,
          skipDuplicates: true, 
        });

        console.log(`Successfully inserted ${wilayaData.length} wilaya records`);
        console.log("Seed Wilaya finished successfully");
      } catch (error) {
        console.error("Error inserting Wilaya:", error);
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