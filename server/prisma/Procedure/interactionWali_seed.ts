import * as fs from "fs";
import * as csv from "csv-parser";
import { PrismaClient, Prisma, EnumAvisWali } from "@prisma/client";

const prisma = new PrismaClient();

function mapAvisWali(value: string | null): EnumAvisWali | null {
  if (!value) return null;

  const v = value.toLowerCase().trim();

  if (v === "favorable") return EnumAvisWali.favorable;
  if (v === "defavorable") return EnumAvisWali.defavorable;

  console.warn("⚠ Valeur inconnue avis wali :", value);
  return null; // ou throw une erreur si tu veux être strict
}

type interactionWliCSV = {
  id_interaction: string;
  id_proc: string;
  id_wilaya: string;
  DelaiWaliDepase: string;
  ALocale_DateReception: string;
  Alocale_Nom_Prenom_Resp_Rec: string;
  Alocale_AvisWaliFavorable: string;
  Alocale_Commentaire: string;
  Alocale_Fait: string;
  AlocaleFaitLe: string;
};

// ------------------ PARSERS -------------------

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr || dateStr === "None" || dateStr === "NaT" || dateStr.trim() === "")
    return null;

  let date: Date | null = null;

  const dmMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (dmMatch) {
    const [, day, month, year, hour = "0", minute = "0"] = dmMatch;
    return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute));
  }

  const ymdMatch = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (ymdMatch) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = ymdMatch;
    return new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second));
  }

  const simple = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (simple) {
    const [, y, m, d] = simple;
    return new Date(Date.UTC(+y, +m - 1, +d));
  }

  const iso = dateStr.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{3}Z)?$/
  );
  if (iso) return new Date(dateStr);

  return null;
}

function parseId(value: string | undefined): number | null {
  const parsed = parseInt(value ?? "", 10);
  return isNaN(parsed) || parsed === 0 ? null : parsed;
}

function parseBoolean(value: string | undefined): boolean | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "1" || v === "true") return true;
  if (v === "0" || v === "false") return false;
  return null;
}

// ------------------ MAIN -------------------

export async function main() {
  const csvFilePath =
    "C:\\Users\\ANAM1408\\Desktop\\BaseSicma_Urgence\\df_interactionWali.csv";

  let totalRows = 0;
  let skippedRows = 0;
  const skippedIds: number[] = [];

  const rows: Prisma.InteractionWaliCreateManyInput[] = [];

  // ------ Load CSV ------
  fs.createReadStream(csvFilePath)
    .pipe(
      csv({
        separator: ";",
        mapHeaders: ({ header }) => header.trim().replace(/\uFEFF/g, ""),
      })
    )
    .on("data", (row: interactionWliCSV) => {
      totalRows++;

      rows.push({
        id_interaction: parseInt(row.id_interaction, 10),
        id_procedure: parseInt(row.id_proc, 10),
        id_wilaya: parseId(row.id_wilaya),
        delai_depasse: parseBoolean(row.DelaiWaliDepase),
        date_envoi: parseDate(row.ALocale_DateReception),
        nom_responsable_reception: row.Alocale_Nom_Prenom_Resp_Rec || null,
        avis_wali: mapAvisWali(row.Alocale_AvisWaliFavorable),
        commentaires: row.Alocale_Commentaire || null,
        date_reponse: parseDate(row.AlocaleFaitLe),
      });
    })
    .on("end", async () => {
      console.log(`CSV loaded: total rows = ${totalRows}`);

      // ------ Insert row by row ------
      for (const row of rows) {
        try {
          await prisma.interactionWali.create({ data: row });
        } catch (err: any) {
          skippedRows++;
          if (row.id_interaction) skippedIds.push(row.id_interaction);
          console.warn(
            `⚠️ Skipped interaction id=${row.id_interaction} — Reason: ${err.code} ${err.message}`
          );
        }
      }

      console.log(`\n✔ Insertion completed.`);
      console.log(`❌ Total skipped rows: ${skippedRows}`);

      if (skippedIds.length > 0) {
        console.log("❗ IDs ignorés:", skippedIds.join(", "));
      }

      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
