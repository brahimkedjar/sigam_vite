import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Demande, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DemandeCSV = {
  id_demande: string;
  id_proc: string;
  id_detenteur: string;
  id_pays: string;
  id_wilaya: string;
  id_daira: string;
  id_commune: string;
  id_typeProc: string;
  id_typePermis: string;
  id_expert: string;
  date_demande: string;
  date_instruction: string;
  intitule_projet: string;
  date_fin_instruction: string;
  lieu_ditFR: string;
  lieu_dit_ar: string;
  superficie: string;
  statut_juridique_terrain: string;
  locPointOrigine: string;
  duree_travaux_estimee: string;
  date_demarrage_prevue: string;
  qualite_signataire: string;
  montant_produit: string;
  con_res_geo: string;
  con_res_exp: string;
  volume_prevu: string;
  DateFinRamassage: string;
  statut_demande: string;
  num_enregist: string;
  remarques: string;
  AreaCat: string;
};

export async function main() {
  const DemandeData: any[] = [];
  const csvFilePath = "C:\\Users\\A\\Desktop\\cleaned_df\\df_demande_test.csv";

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

  // Pre-fetch all existing foreign key IDs - using correct table names
  let existingProcIds: Set<number>;
  let existingDetenteurIds: Set<number>;
  let existingPaysIds: Set<number>;
  let existingWilayaIds: Set<number>;
  let existingDairaIds: Set<number>;
  let existingCommuneIds: Set<number>;
  let existingTypeProcIds: Set<number>;
  let existingTypePermisIds: Set<number>;
  let existingExpertIds: Set<number>;

  try {
    console.log("Fetching existing foreign key references...");
    
    // Use the actual table names from your Prisma schema
    // Replace these with your actual model names
    [existingProcIds, existingDetenteurIds, existingPaysIds, existingWilayaIds, 
     existingDairaIds, existingCommuneIds, existingTypeProcIds, 
     existingTypePermisIds, existingExpertIds] = await Promise.all([
      // Adjust these to match your actual Prisma model names
      prisma.procedure.findMany({ select: { id_proc: true } }).then(res => new Set(res.map(r => r.id_proc))),
      prisma.detenteurMorale.findMany({ select: { id_detenteur: true } }).then(res => new Set(res.map(r => r.id_detenteur))),
      prisma.pays.findMany({ select: { id_pays: true } }).then(res => new Set(res.map(r => r.id_pays))),
      prisma.wilaya.findMany({ select: { id_wilaya: true } }).then(res => new Set(res.map(r => r.id_wilaya))),
      prisma.daira.findMany({ select: { id_daira: true } }).then(res => new Set(res.map(r => r.id_daira))),
      prisma.commune.findMany({ select: { id_commune: true } }).then(res => new Set(res.map(r => r.id_commune))),
      prisma.typeProcedure.findMany({ select: { id: true } }).then(res => new Set(res.map(r => r.id))),
      prisma.typePermis.findMany({ select: { id: true } }).then(res => new Set(res.map(r => r.id))),
      prisma.expertMinier.findMany({ select: { id_expert: true } }).then(res => new Set(res.map(r => r.id_expert)))
    ]);

    console.log("Foreign key references loaded successfully");
  } catch (error) {
    console.error("Error fetching foreign key references:", error);
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
    .on("data", (row: DemandeCSV) => {
  let id_proc = Number(row.id_proc) || null;
  if (id_proc !== null && !existingProcIds.has(id_proc)) {
    console.warn(`Demande ${row.id_demande}: id_proc ${id_proc} not found, setting to null`);
    id_proc = null;
  }

  const id_detenteur = Number(row.id_detenteur) === 0 ? null : Number(row.id_detenteur);
  const id_pays = Number(row.id_pays) === 0 ? null : Number(row.id_pays);
  const id_wilaya = Number(row.id_wilaya) === 0 ? null : Number(row.id_wilaya);
  const id_daira = Number(row.id_daira) === 0 ? null : Number(row.id_daira);
  const id_commune = Number(row.id_commune) === 0 ? null : Number(row.id_commune);
  const id_typeProc = Number(row.id_typeProc) || null;
  const id_typePermis = Number(row.id_typePermis) || null;
  const id_expert = Number(row.id_expert) === 0 ? null : Number(row.id_expert);

  // validate the rest normally
  const missingReferences: string[] = [];
  if (id_detenteur !== null && !existingDetenteurIds.has(id_detenteur)) missingReferences.push(`detenteur: ${id_detenteur}`);
  if (id_pays !== null && !existingPaysIds.has(id_pays)) missingReferences.push(`pays: ${id_pays}`);
  if (id_wilaya !== null && !existingWilayaIds.has(id_wilaya)) missingReferences.push(`wilaya: ${id_wilaya}`);
  if (id_daira !== null && !existingDairaIds.has(id_daira)) missingReferences.push(`daira: ${id_daira}`);
  if (id_commune !== null && !existingCommuneIds.has(id_commune)) missingReferences.push(`commune: ${id_commune}`);
  if (id_typeProc !== null && !existingTypeProcIds.has(id_typeProc)) missingReferences.push(`typeProc: ${id_typeProc}`);
  if (id_typePermis !== null && !existingTypePermisIds.has(id_typePermis)) missingReferences.push(`typePermis: ${id_typePermis}`);
  if (id_expert !== null && !existingExpertIds.has(id_expert)) missingReferences.push(`expert: ${id_expert}`);

  if (missingReferences.length > 0) {
    console.warn(`Skipping demande ${row.id_demande}: Missing foreign key references - ${missingReferences.join(', ')}`);
    return;
  }

  DemandeData.push({
    id_demande: Number(row.id_demande?.trim()),
    id_proc,
    id_detenteur,
    id_pays,
    id_wilaya,
    id_daira,
    id_commune,
    id_typeProc,
    id_typePermis,
    id_expert,
    date_demande: row.date_demande ? new Date(row.date_demande) : null,
    date_instruction: row.date_instruction ? new Date(row.date_instruction) : null,
    intitule_projet: row.intitule_projet || '',
    date_fin_instruction: row.date_fin_instruction ? new Date(row.date_fin_instruction) : null,
    lieu_ditFR: row.lieu_ditFR || '',
    lieu_dit_ar: row.lieu_dit_ar || '',
    superficie: parseFloat(row.superficie) || 0,
    AreaCat: parseFloat(row.AreaCat) || 0,
    statut_juridique_terrain: row.statut_juridique_terrain || '',
    locPointOrigine: row.locPointOrigine || '',
    duree_travaux_estimee: row.duree_travaux_estimee || '',
    date_demarrage_prevue: row.date_demarrage_prevue ? new Date(row.date_demarrage_prevue) : null,
    qualite_signataire: row.qualite_signataire || '',
    montant_produit: row.montant_produit || '',
    con_res_geo: row.con_res_geo || '',
    con_res_exp: row.con_res_exp || '',
    volume_prevu: row.volume_prevu || '',
    date_fin_ramassage: row.DateFinRamassage ? new Date(row.DateFinRamassage) : null,
    statut_demande: row.statut_demande || '',
    num_enregist: row.num_enregist || '',
    remarques: row.remarques || '',
  });
})

    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");
      console.log(`Found ${DemandeData.length} valid records to insert`);

      if (DemandeData.length === 0) {
        console.log('No valid data to insert');
        await prisma.$disconnect();
        return;
      }

      try {
        // Insert in smaller batches and log each record for debugging
        const batchSize = 100;
        for (let i = 0; i < DemandeData.length; i += batchSize) {
          const batch = DemandeData.slice(i, i + batchSize);
          
          // Debug: log the first record of each batch
          if (batch.length > 0) {
            console.log(`Batch ${i / batchSize + 1}, first record:`, JSON.stringify(batch[0], null, 2));
          }
          
          try {
            await prisma.demande.createMany({
              data: batch,
              skipDuplicates: true,
            });
            console.log(`Inserted batch ${i / batchSize + 1}: ${batch.length} records`);
          } catch (batchError) {
            console.error(`Error in batch ${i / batchSize + 1}:`, batchError);
            // Try inserting records one by one to identify the problematic record
            for (const record of batch) {
              try {
                await prisma.demande.create({
                  data: record,
                });
              } catch (recordError) {
                console.error('Failed to insert record:', JSON.stringify(record, null, 2));
                console.error('Record error:', recordError);
              }
            }
          }
        }

        console.log(`Successfully inserted ${DemandeData.length} demande records`);
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