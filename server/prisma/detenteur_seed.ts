import * as fs from 'fs';
import csv = require('csv-parser');
import { DetenteurMorale, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DetenteurCSV = {
  id_detenteur: string;
  id_pays: string;
  id_statutJuridique: string;
  nom_socFR: string;
  nom_socAR: string;
  adresse_siege: string;
  telephone: string;
  fax: string;
  email: string;
  site_web: string;
};

export async function main() {
  const DetenteurData: any[] = [];
  const csvFilePath =
    "C:\\Users\\A\\Desktop\\cleaned_df\\df_detenteur.csv";

  fs.createReadStream(csvFilePath)
    .pipe(
        csv({
          separator: ';',
          mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""), 
        })
      )
    .on("data", (row: DetenteurCSV) => {
      DetenteurData.push({
        id_detenteur: Number(row.id_detenteur?.trim()),
        id_pays: Number(row.id_pays) === 0 ? null : Number(row.id_pays),
        id_statutJuridique: Number(row.id_statutJuridique) === 0 ? null : Number(row.id_statutJuridique),
        nom_societeFR: row.nom_socFR,
        nom_societeAR: row.nom_socAR,
        adresse_siege: row.adresse_siege,
        telephone: row.telephone,
        fax: row.fax,
        email: row.email,
        site_web: row.site_web,
      });
    })
    .on("end", async () => {
      console.log("CSV loaded, inserting into database...");

      try {
        await prisma.detenteurMorale.createMany({
          data: DetenteurData,
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
