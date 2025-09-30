import * as fs from 'fs';
import * as csv from 'csv-parser';
import { demandeVerificationGeo, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DemVerGeoCSV = {
  id_demVerif: string;
  id_demande: string;
  verification_cadastrale_ok: string; // Changed to string since CSV contains strings
  sit_geo_ok: string;
  empiet_ok: string;
  superf_ok: string;
  geom_ok: string;
};

// Function to convert string to boolean
function stringToBoolean(value: string): boolean {
  if (value === "True" || value === "true" || value === "1") {
    return true;
  }
  return false;
}

export async function main() {
  const DemVerGeotData: any[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\cleaned_df\\df_demandeVerificationGeo.csv";

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
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
      })
    )
    .on("data", (row: DemVerGeoCSV) => {
      console.log("ROW:", row);

      // Validate required fields
      if (!row.id_demVerif || !row.id_demande) {
        console.warn('Skipping row with missing required data:', row);
        return;
      }

      // Convert string boolean values to actual booleans
      DemVerGeotData.push({
        id_demVerif: Number(row.id_demVerif?.trim()),
        id_demande: Number(row.id_demande),
        verification_cadastrale_ok: stringToBoolean(row.verification_cadastrale_ok),
        sit_geo_ok: stringToBoolean(row.sit_geo_ok),
        empiet_ok: stringToBoolean(row.empiet_ok),
        superf_ok: stringToBoolean(row.superf_ok),
        geom_ok: stringToBoolean(row.geom_ok),
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");
      console.log(`Found ${DemVerGeotData.length} records to insert`);

      if (DemVerGeotData.length === 0) {
        console.log('No data to insert');
        await prisma.$disconnect();
        return;
      }

      try {
        await prisma.demandeVerificationGeo.createMany({
          data: DemVerGeotData,
          skipDuplicates: true,
        });

        console.log(`Successfully inserted ${DemVerGeotData.length} demandeVerificationGeo records`);
        console.log("Seed finished.");
      } catch (error) {
        console.error("Error inserting data:", error);
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