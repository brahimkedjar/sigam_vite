import * as fs from 'fs';
import * as csv from 'csv-parser';
import { demandeObs, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DemObsCSV = {
  id_demObs: string; // This matches the CSV header
  id_demande: string;
  obs_situation_geo: string;
  obs_empietement: string;
  obs_emplacement: string;
  obs_geom: string;
  obs_superficie: string;
};

export async function main() {
  const DemObsData: any[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\cleaned_df\\df_demandeObs.csv";

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

  // First, get all existing demande IDs to validate foreign keys
  let existingDemandeIds: Set<number>;
  try {
    const existingDemandes = await prisma.demande.findMany({
      select: { id_demande: true }
    });
    existingDemandeIds = new Set(existingDemandes.map(d => d.id_demande));
    console.log(`Found ${existingDemandeIds.size} existing demande records`);
  } catch (error) {
    console.error("Error fetching existing demande IDs:", error);
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
    .on("data", (row: DemObsCSV) => {
      console.log("ROW:", row);

      // Validate required fields
      if (!row.id_demObs || !row.id_demande) {
        console.warn('Skipping row with missing required data:', row);
        return;
      }

      const id_demande = Number(row.id_demande);
      
      // Check if the foreign key exists
      if (!existingDemandeIds.has(id_demande)) {
        console.warn(`Skipping row: demande with id ${id_demande} does not exist`);
        return;
      }

      DemObsData.push({
        id_demandeObs: Number(row.id_demObs?.trim()), // Map to the correct field name
        id_demande: id_demande,
        obs_situation_geo: row.obs_situation_geo || '',
        obs_empietement: row.obs_empietement || '',
        obs_emplacement: row.obs_emplacement || '',
        obs_geom: row.obs_geom || '',
        obs_superficie: row.obs_superficie || '',
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");
      console.log(`Found ${DemObsData.length} valid records to insert`);

      if (DemObsData.length === 0) {
        console.log('No valid data to insert');
        await prisma.$disconnect();
        return;
      }

      try {
        // Insert in batches to avoid timeouts
        const batchSize = 1000;
        for (let i = 0; i < DemObsData.length; i += batchSize) {
          const batch = DemObsData.slice(i, i + batchSize);
          await prisma.demandeObs.createMany({
            data: batch,
            skipDuplicates: true,
          });
          console.log(`Inserted batch ${i / batchSize + 1}: ${batch.length} records`);
        }

        console.log(`Successfully inserted ${DemObsData.length} demandeObs records`);
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