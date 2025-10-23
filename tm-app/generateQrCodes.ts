import fs from "fs";
import * as crypto from "crypto"; // module pour le hachage SHA-256
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

// Définition du type pour les tables utilisés
interface Titre {
  [key: string]: string;
  id: string;
  Code: string;
  idType: string;
  idDetenteur: string;
  DateDemande: string;
  code_wilaya: string;
  DateHeureSysteme: string;
  QrCode: string;
}

interface Detenteur {
  id: string;
  Nom: string;
}

interface TypeTitre {
  id: string;
  Code: string;
}

//  lire un CSV et le convertir en tableau d’objets
async function readCSV<T>(path: string): Promise<T[]> {
  const content = await fs.promises.readFile(path, "utf8");
  const records = parse(content, {
    columns: (header: string[]) =>
      header.map((h) => h.replace(/^\ufeff/, "").trim()),
    delimiter: ";",
    bom: true,
    trim: true,
    skip_empty_lines: false,
  }) as T[];
  return records;
}

//écrire un CSV en conservant l’ordre des colonnes
function writeCSV<T extends Record<string, string>>(
  path: string,
  data: T[],
  columns: string[]
) {
  const rows = data.map((entry) => {
    const row: Record<string, string> = {};
    for (const col of columns) {
      const value = entry[col];
      row[col] = value ?? "";
    }
    return row;
  });

  const csvOutput = stringify(rows, {
    header: true,
    columns,
    delimiter: ";",
  });

  fs.writeFileSync(path, csvOutput, "utf8");
}

//  générer un code QR unique basé sur SHA-256
function genererCodeUnique(
  code_permis: string,
  type_titre: string,
  date_demande: string,
  code_wilaya: string,
  nom_societe: string
) {
  const date_systeme = new Date();
  const date_heure_systeme = date_systeme.toISOString();
  const horodatage_hash = date_heure_systeme.replace(/[-:TZ.]/g, "");
  const combined = `${code_permis}${type_titre}${date_demande}${code_wilaya}${nom_societe}${horodatage_hash}`;
  const hash = crypto
    .createHash("sha256")
    .update(combined)
    .digest("hex")
    .toUpperCase();
  const baseCode = hash.substring(0, 20);
  const code_unique = baseCode.match(/.{1,5}/g)?.join("-") ?? baseCode;
  return {
    code_unique,
    date_heure_systeme,
  };
}

async function main() {
  const titres = await readCSV<Titre>("data/df_titreQRCode.csv");
  const detenteurs = await readCSV<Detenteur>("data/Detenteurs.csv");
  const typeTitres = await readCSV<TypeTitre>("data/TypesTitres.csv");
  const titreColumns = titres.length > 0 ? Object.keys(titres[0]!) : [];

  console.log(`Titres charges : ${titres.length}`);
  console.log(`Detenteurs charges : ${detenteurs.length}`);
  console.log(`TypesTitres charges : ${typeTitres.length}`);
  console.log("--------------------------------");

  let codesGen = 0;
  let codesIgn = 0;

  for (const t of titres) {
    const idDet = String(t.idDetenteur).replace(".0", "").trim();
    const idType = String(t.idType).replace(".0", "").trim();

    // Chercher le détenteur et le type correspondant
    const detenteur = detenteurs.find(
      (d) => String(d.id).replace(".0", "").trim() === idDet
    );
    const typeTitre = typeTitres.find(
      (tt) => String(tt.id).replace(".0", "").trim() === idType
    );

    console.log(
      "Recherche detenteur et type pour titre :",
      t.id,
      "idDetenteur:",
      t.idDetenteur,
      "idType:",
      t.idType
    );

// Si détenteur ou type introuvable
    if (!detenteur || !typeTitre) {
      console.warn(
        `Attention: titre ${t.id || "inconnu"} ignore (idDet=${idDet}, idType=${idType})`
      );
      console.log("   Titre brut :", {
        Code: t.Code,
        idType: t.idType,
        idDetenteur: t.idDetenteur,
        code_wilaya: t.code_wilaya,
      });
      t.DateHeureSysteme = "";
      t.QrCode = "";
      codesIgn++;
      continue;
    }

// Générer le QR code
    const { code_unique, date_heure_systeme } = genererCodeUnique(
      t.Code.padStart(5, "0"),
      typeTitre.Code,
      t.DateDemande.replace(/[^0-9]/g, ""),
      t.code_wilaya.padStart(2, "0"),
      detenteur.Nom
    );

    console.log({
      id: t.id,
      code_permis: t.Code,
      type_titre: typeTitre.Code,
      nom_societe: detenteur.Nom,
      date_heure_systeme,
      code_unique,
    });
     // Mettre à jour le titre
    t.DateHeureSysteme = date_heure_systeme;
    t.QrCode = code_unique;
    codesGen++;
  }

  // Écriture du CSV mis à jour
  if (titres.length > 0 && titreColumns.length > 0) {
    const outputPath = "data/df_titreQRCode.csv";
    try {
      writeCSV(outputPath, titres, titreColumns);
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "EBUSY" || err.code === "EPERM") {
        const fallbackPath = "data/df_titreQRCode.generated.csv";
        console.warn(
          `Attention: impossible d'ecrire dans ${outputPath} (fichier occupe). Sauvegarde dans ${fallbackPath}.`
        );
        try {
          writeCSV(fallbackPath, titres, titreColumns);
        } catch (fallbackErr) {
          const fallbackError = fallbackErr as NodeJS.ErrnoException;
          console.warn(
            `Attention: echec de la sauvegarde dans ${fallbackPath} (${fallbackError.code ?? "erreur inconnue"}). Le contenu reste seulement en memoire.`
          );
        }
      } else {
        throw error;
      }
    }
  }

  console.log("--------------------------------");
  console.log(`Codes generes : ${codesGen}`);
  console.log(`Enregistrements ignores : ${codesIgn}`);
  console.log("--------------------------------");
}

main().catch(console.error);
