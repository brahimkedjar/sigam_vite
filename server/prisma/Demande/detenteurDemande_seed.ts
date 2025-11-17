import * as fs from 'fs';
import csv = require('csv-parser');
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type detenteurDemandeCSV = {
  id_detenteurDemande: string;
  id_demandeGeneral: string;
  id_detenteur: string;
  role_detenteur: string;

};

export async function main() {
  const detenteurDemandeData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\sigam_vite\\BaseSicma_Urgence\\df_detenteurDemande.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: detenteurDemandeCSV) => {
      detenteurDemandeData.push({
        id_detenteurDemande: Number(row.id_detenteurDemande.trim()),
        id_demandeGeneral: Number(row.id_demandeGeneral.trim()),
        id_detenteur: Number(row.id_detenteur.trim()),
        role_detenteur: row.role_detenteur || null,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.detenteurDemande.createMany({
          data: detenteurDemandeData,
          skipDuplicates: true,
        });

        console.log("Seed finished.");
      } catch (error) {
        console.error("Error inserting data:", error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
