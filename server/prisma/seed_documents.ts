// seed.ts
import { PrismaClient, MissingAction } from '@prisma/client';

const prisma = new PrismaClient();


type SeedDocument = {
  nom_doc: string;
  description: string;
  format: string;
  taille_doc: string;
  is_obligatoire?: boolean;
  missing_action?: MissingAction;
  reject_message?: string | null;
};

type SeedDossier = {
  id_typeproc: number;
  id_typePermis: number;
  nombre_doc: number;
  remarques?: string;
  documents: SeedDocument[];
};

const criticalDocPatterns = [/formulaire/, /registre/, /statut/, /justificatif/, /paiement/, /frais/];
const blockingDocPatterns = [/programme/, /planning/, /carte/, /plan/, /cahier/];
const warningDocPatterns = [/rapport/, /notice/, /memoire/, /bilan/, /attestation/];

const classifyRequirement = (doc: SeedDocument): { is_obligatoire: boolean; missing_action: MissingAction; reject_message: string | null } => {
  if (doc.is_obligatoire !== undefined || doc.missing_action || doc.reject_message !== undefined) {
    return {
      is_obligatoire: doc.is_obligatoire ?? true,
      missing_action: doc.missing_action ?? 'BLOCK_NEXT',
      reject_message: doc.reject_message ?? null,
    };
  }

  const lowerName = doc.nom_doc.toLowerCase();

  if (criticalDocPatterns.some((pattern) => pattern.test(lowerName))) {
    return {
      is_obligatoire: true,
      missing_action: 'REJECT',
      reject_message: 'Piece essentielle manquante',
    };
  }

  if (blockingDocPatterns.some((pattern) => pattern.test(lowerName))) {
    return {
      is_obligatoire: true,
      missing_action: 'BLOCK_NEXT',
      reject_message: null,
    };
  }

  if (warningDocPatterns.some((pattern) => pattern.test(lowerName))) {
    return {
      is_obligatoire: true,
      missing_action: 'WARNING',
      reject_message: null,
    };
  }

  return {
    is_obligatoire: false,
    missing_action: 'WARNING',
    reject_message: null,
  };
};



async function main() {
 // Complete Seed Script for Mining Permits Application System

const dossierData: SeedDossier[] = [
  // 1. Permis de prospection (PPM) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 1, // Permis de prospection
    nombre_doc: 8,
    remarques: "Dossier standard de demande de permis de prospection miniere",
    documents: [
      {
        nom_doc: "Demande sur imprime de l'agence nationale des activites minieres",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts de la societe",
        description: "Statuts juridiques de la societe demandeuse",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du registre de commerce",
        description: "Preuve d'enregistrement commercial",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs de capacites techniques",
        description: "Competences en recherches minieres et moyens techniques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites financieres",
        description: "Bilans et comptes d'exploitation des 3 derniers exercices",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme et planning des travaux",
        description: "Detail des travaux prevus et methodes de prospection",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Carte localisant le perimetre demande avec coordonnees UTM",
        format: "PDF/Image",
        taille_doc: "1/25.000 au 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Cahier des charges renseigne",
        description: "Document contractuel dument complete et signe",
        format: "PDF",
        taille_doc: "Variable"
      },
      
    ]
  },
  
  // 2. Permis de prospection (PPM) - Renouvellement
  {
    id_typeproc: 2, // Renouvellement
    id_typePermis: 1, // Permis de prospection
    nombre_doc: 4,
    remarques: "Dossier standard de demande de prorogation de permis de prospection miniere",
    documents: [
      {
        nom_doc: "Demande de renouvellement sur imprime de l'agence",
        description: "Formulaire officiel de demande de prorogation",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Rapport sur les travaux effectues",
        description: "Bilan des travaux realises pendant la periode precedente",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme et planning des nouveaux travaux",
        description: "Detail des travaux prevus pour la periode de renouvellement",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT actualisee",
        description: "Carte localisant le perimetre avec coordonnees UTM",
        format: "PDF/Image",
        taille_doc: "1/25.000 au 1/50.000 ou 1/200.000"
      }
    ]
  },

  // 3. Permis d'exploration (PEM) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 2, // Permis d'exploration
    nombre_doc: 14,
    remarques: "Dossier standard de demande de permis d'exploration miniere",
    documents: [
      {
        nom_doc: "Demande sur imprime de l'agence nationale des activites minieres",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts de la societe",
        description: "Statuts juridiques de la societe demandeuse",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du registre de commerce",
        description: "Preuve d'enregistrement commercial",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs de capacites techniques",
        description: "Competences en exploration miniere et moyens techniques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites financieres",
        description: "Bilans et comptes d'exploitation des 3 derniers exercices",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Memoire sur les travaux realises",
        description: "Rapport sur les resultats des explorations precedentes",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Presentation de l'objectif et methodologie",
        description: "Etude de mise en valeur du gisement",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme de developpement des travaux",
        description: "Couts, planning et methodes d'exploration",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Encadrement technique et emploi",
        description: "Plan de ressources humaines",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude d'impact sur l'environnement",
        description: "Analyse des impacts environnementaux",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Carte localisant le perimetre demande",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Cahier des charges renseigne",
        description: "Document contractuel dument complete et signe",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du permis de prospection miniere",
        description: "Si applicable - permis en cours de validite",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Rapport sur les travaux realises",
        description: "Resultats obtenus par la prospection miniere",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 4. Permis d'exploration (PEM) - Renouvellement
  {
    id_typeproc: 2, // Renouvellement
    id_typePermis: 2, // Permis d'exploration
    nombre_doc: 10,
    remarques: "Dossier standard de prorogation de permis d'exploration miniere",
    documents: [
      {
        nom_doc: "Demande de renouvellement sur imprime de l'agence",
        description: "Formulaire officiel de demande de prorogation",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie du permis d'exploration en cours",
        description: "Permis dont la prorogation est demandee",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT actualisee",
        description: "Localisation du perimetre minier",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Rapport geologique sur les travaux effectues",
        description: "Illustre par des plans, croquis et coupes",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etat d'execution des engagements",
        description: "Bilan des engagements souscrits",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme et planning des travaux projetes",
        description: "Avec estimation des depenses",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Moyens humains et materiels a mettre en uvre",
        description: "Plan de ressources pour la nouvelle periode",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude d'impact sur l'environnement actualisee",
        description: "Incluant mesures d'attenuation et remise en etat",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Attestation de paiement des droits et taxes",
        description: "Preuve que le demandeur est a jour",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Cahier des charges actualise",
        description: "Document contractuel mis a jour et signe",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 5. Permis d'exploitation (PEX) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 3, // Permis d'exploitation
    nombre_doc: 13,
    remarques: "Dossier standard de demande de permis d'exploitation de mines",
    documents: [
      {
        nom_doc: "Demande sur imprime de l'agence nationale des activites minieres",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts de la societe",
        description: "Statuts juridiques de la societe demandeuse",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du registre de commerce",
        description: "Preuve d'enregistrement commercial",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs de capacites techniques",
        description: "References dans l'exploitation miniere",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites financieres",
        description: "Bilans des 3 derniers exercices",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du permis d'exploration miniere",
        description: "Si applicable - permis en cours de validite",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Rapport sur les travaux realises",
        description: "Resultats des phases de recherche miniere",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie de l'etude de faisabilite",
        description: "Etude technique et economique detaillee",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Carte localisant le perimetre demande",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Etude d'impact sur l'environnement",
        description: "Avec plan de gestion environnemental",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude de dangers",
        description: "Analyse des risques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Autorisation d'etablissement classe",
        description: "Document d'autorisation",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme de restauration",
        description: "Plan de remise en etat des lieux",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 6. Permis d'exploitation (PEX) - Renouvellement
  {
    id_typeproc: 2, // Renouvellement
    id_typePermis: 3, // Permis d'exploitation
    nombre_doc: 12,
    remarques: "Dossier standard de renouvellement de permis d'exploitation de mines",
    documents: [
      {
        nom_doc: "Demande de renouvellement sur imprime de l'agence",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie du permis d'exploitation en cours",
        description: "Permis dont le renouvellement est demande",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Rapport sur les travaux d'exploitation realises",
        description: "Investissements, productions et protection environnementale",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Rapport geologique actualise",
        description: "Sur le ou les gisement(s) exploite(s)",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Rapport sur les travaux d'exploration complementaire",
        description: "Si applicable - travaux realises pendant la periode",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude de faisabilite technique et economique actualisee",
        description: "Nouveau plan de developpement et d'exploitation",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Plan d'encadrement technique et emploi",
        description: "Ressources humaines pour la nouvelle periode",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Engagement de rapport geologique biennal",
        description: "Engagement formel de fournir des rapports",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Attestation de paiement des droits et taxes",
        description: "Preuve que le demandeur est a jour",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude d'impact sur l'environnement actualisee",
        description: "Avec plan de gestion environnemental",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etat de la remise en etat des lieux",
        description: "Bilan des actions deja realisees",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Cahier des charges actualise",
        description: "Document contractuel mis a jour et signe",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 7. Permis de recherche carriere (PRC) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 5, // Permis de recherche carriere
    nombre_doc: 8,
    remarques: "Dossier standard de demande de permis de recherche carriere",
    documents: [
      {
        nom_doc: "Demande sur imprime de la wilaya ou de l'agence",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts de la societe",
        description: "Statuts juridiques de la societe demandeuse",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du registre de commerce",
        description: "Preuve d'enregistrement commercial",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs de capacites techniques",
        description: "Competences en recherche carriere",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites financieres",
        description: "Bilans des 3 derniers exercices",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme et planning des travaux",
        description: "Detail des travaux de recherche prevus",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Localisation du perimetre demande",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Cahier des charges renseigne",
        description: "Document contractuel dument complete et signe",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 8. Permis d'exploitation carriere (PEC) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 6, // Permis d'exploitation carriere
    nombre_doc: 14,
    remarques: "Dossier standard de demande de permis d'exploitation de carrieres",
    documents: [
      {
        nom_doc: "Demande sur imprime de la wilaya ou de l'agence",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts de la societe",
        description: "Statuts juridiques de la societe demandeuse",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du registre de commerce",
        description: "Preuve d'enregistrement commercial",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs de capacites techniques",
        description: "References dans l'exploitation de carrieres",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites financieres",
        description: "Bilans des 3 derniers exercices",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie du permis de recherche carriere",
        description: "Si applicable - permis en cours de validite",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Memoire sur les travaux realises",
        description: "Resultats des phases de recherche",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Copie de l'etude de faisabilite",
        description: "Etude technique et economique detaillee",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Caracteristiques du tout-venant",
        description: "Pour les materiaux de construction",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Schema de traitement valide",
        description: "Procede retenu pour les materiaux",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Localisation du perimetre demande",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Etude d'impact sur l'environnement",
        description: "Avec plan de gestion environnemental",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Etude de dangers",
        description: "Analyse des risques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Programme de restauration",
        description: "Plan de remise en etat des lieux",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 9. Autorisation artisanale mine (ARM) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 7, // Autorisation artisanale mine
    nombre_doc: 8,
    remarques: "Dossier standard de demande d'autorisation artisanale miniere",
    documents: [
      {
        nom_doc: "Demande sur imprime de l'agence",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts ou piece d'identite",
        description: "Pour personnes morales ou physiques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites techniques et financieres",
        description: "Capacites a realiser le projet",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Localisation du perimetre demande",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Memoire technique",
        description: "Methode retenue d'exploitation artisanale",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Substances visees",
        description: "Liste des substances a exploiter",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Notice ou etude d'impact",
        description: "Selon l'incidence sur l'environnement",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Cahier des charges renseigne",
        description: "Document contractuel dument complete et signe",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  },

  // 10. Permis de ramassage (PRA) - Demande initiale
  {
    id_typeproc: 1, // Demande initiale
    id_typePermis: 9, // Permis de ramassage
    nombre_doc: 7,
    remarques: "Dossier standard de demande de permis de ramassage",
    documents: [
      {
        nom_doc: "Demande sur imprime de l'agence",
        description: "Formulaire officiel de demande",
        format: "PDF",
        taille_doc: "A4"
      },
      {
        nom_doc: "Copie des statuts ou piece d'identite",
        description: "Pour personnes morales ou physiques",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Justificatifs des capacites techniques et financieres",
        description: "Capacites a realiser l'activite de ramassage",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Carte topographique INCT",
        description: "Localisation de la zone de ramassage",
        format: "PDF/Image",
        taille_doc: "1/25.000, 1/50.000 ou 1/200.000"
      },
      {
        nom_doc: "Memoire technique",
        description: "Methode retenue de ramassage, collecte ou recolte",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Substances visees",
        description: "Liste des substances a ramasser",
        format: "PDF",
        taille_doc: "Variable"
      },
      {
        nom_doc: "Notice d'impact sur l'environnement",
        description: "Analyse des impacts environnementaux",
        format: "PDF",
        taille_doc: "Variable"
      }
    ]
  }
];

// Implementation script
async function seedDatabase() {
  console.log("Starting database seeding...");

  // 1. First delete existing data if needed (optional)
  await prisma.dossierDocument.deleteMany();
  await prisma.dossierAdministratif.deleteMany();
  await prisma.document.deleteMany();

  // 2. Create all unique documents first
  const allUniqueDocuments: {[key: string]: any} = {};
  
  // Collect all unique documents across all dossiers
  for (const dossier of dossierData) {
    for (const doc of dossier.documents) {
      const key = `${doc.nom_doc}-${doc.description}-${doc.format}-${doc.taille_doc}`;
      if (!allUniqueDocuments[key]) {
        allUniqueDocuments[key] = doc;
      }
    }
  }

  // Create documents in database and map them
  const documentMap = new Map<string, number>();
  for (const [key, doc] of Object.entries(allUniqueDocuments)) {
    const createdDoc = await prisma.document.create({
      data: {
        nom_doc: doc.nom_doc,
        description: doc.description,
        format: doc.format,
        taille_doc: doc.taille_doc
      }
    });
    documentMap.set(key, createdDoc.id_doc);
  }

  console.log(`Created ${documentMap.size} unique documents`);

  // 3. Create dossiers and their relationships
  for (const dossier of dossierData) {
    const createdDossier = await prisma.dossierAdministratif.create({
      data: {
        id_typeproc: dossier.id_typeproc,
        id_typePermis: dossier.id_typePermis,
        nombre_doc: dossier.nombre_doc,
        remarques: dossier.remarques
      }
    });

    // Create dossier-document relationships
    for (const doc of dossier.documents) {
      const key = `${doc.nom_doc}-${doc.description}-${doc.format}-${doc.taille_doc}`;
      const docId = documentMap.get(key);
      
      if (!docId) {
        throw new Error(`Document not found: ${key}`);
      }
      
      const requirement = classifyRequirement(doc);

      await prisma.dossierDocument.create({
        data: {
          id_dossier: createdDossier.id_dossier,
          id_doc: docId,
          is_obligatoire: requirement.is_obligatoire,
          missing_action: requirement.missing_action,
          reject_message: requirement.reject_message,
        }
      });
    }
    
    console.log(`Created dossier ${createdDossier.id_dossier} with ${dossier.documents.length} document relations`);
  }

  // Verification
  const totalDocuments = await prisma.document.count();
  const totalRelations = await prisma.dossierDocument.count();
  
  console.log(`
    Seeding complete!
    Total documents: ${totalDocuments} (should be less than before)
    Total dossier-document relationships: ${totalRelations}
  `);
}

// Execute the seeding function
seedDatabase()
  .then(() => {
    console.log("Seeding process finished successfully");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Error during seeding:", e);
    prisma.$disconnect();
    process.exit(1);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
