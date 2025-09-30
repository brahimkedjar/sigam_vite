// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// seed.ts
async function main() {
 
  

await prisma.typeProcedure.createMany({
    data: [
      // Initial Requests
      { libelle: 'demande', description: 'Demande initiale de permis' },
      { libelle: 'renouvellement', description: 'Renouvellement de permis' },
      
      // Modifications
      { libelle: 'extension', description: 'Extension de superficie ou durée' },
      { libelle: 'modification', description: 'Modification des conditions' },
      { libelle: 'fusion', description: 'Fusion de permis' },
      { libelle: 'division', description: 'Division de permis' },
      
      // Transfers
      { libelle: 'transfert', description: 'Transfert de droits' },
      { libelle: 'cession', description: 'Cession partielle' },
      
      // Termination
      { libelle: 'renonciation', description: 'Renonciation au permis' },
      { libelle: 'retrait', description: 'Retrait administratif' },
      
      // Special Procedures
      { libelle: 'regularisation', description: 'Procédure de régularisation' },
      { libelle: 'recours', description: 'Recours administratif' },
      { libelle: 'arbitrage', description: 'Demande d\'arbitrage' }
    ],
    skipDuplicates: true
  });

  console.log('Seed data created successfully');
  // console.log(`Created ${typePermis.count} TypePermis entries`);
  // console.log(`Created ${typeProcedures.count} TypeProcedure entries`);


    await prisma.superficiaireBareme.createMany({
    data: [
      // Mining Exploration (PEM)
      { 
        id: 1,
        droit_fixe: 5000,
        periode_initiale: 100,
        premier_renouv: 150,
        autre_renouv: 200,
        devise: 'DZD'
      },
      // Mining Exploitation (PEX)
      { 
        id: 2,
        droit_fixe: 10000,
        periode_initiale: 200,
        premier_renouv: 250,
        autre_renouv: 300,
        devise: 'DZD'
      },
      // Small Mine Exploration
      { 
        id: 3,
        droit_fixe: 5000,
        periode_initiale: 100,
        premier_renouv: 150,
        autre_renouv: 200,
        devise: 'DZD'
      },
      // Small Mine Exploitation
      { 
        id: 4,
        droit_fixe: 10000,
        periode_initiale: 200,
        premier_renouv: 250,
        autre_renouv: 300,
        devise: 'DZD'
      },
      // Quarry Research
      { 
        id: 5,
        droit_fixe: 5000,
        periode_initiale: 150,
        premier_renouv: 200,
        autre_renouv: 150,
        devise: 'DZD'
      },
      // Quarry Exploitation
      { 
        id: 6,
        droit_fixe: 10000,
        periode_initiale: 250,
        premier_renouv: 300,
        autre_renouv: 350,
        devise: 'DZD'
      },
      // Artisanal Mine
      { 
        id: 7,
        droit_fixe: 5000,
        periode_initiale: 100,
        premier_renouv: 150,
        autre_renouv: 200,
        devise: 'DZD'
      },
      // Artisanal Quarry
      { 
        id: 8,
        droit_fixe: 5000,
        periode_initiale: 150,
        premier_renouv: 200,
        autre_renouv: 150,
        devise: 'DZD'
      },
      // Collection Permit
      { 
        id: 9,
        droit_fixe: 0,
        periode_initiale: 0,
        premier_renouv: 0,
        autre_renouv: 0,
        devise: 'DZD'
      },
      // Transport Permit
      { 
        id: 10,
        droit_fixe: 0,
        periode_initiale: 0,
        premier_renouv: 0,
        autre_renouv: 0,
        devise: 'DZD'
      }
    ],
    skipDuplicates: true
  });

 await prisma.typePermis.createMany({
    data: [
      // Mining Permits
      {
        id_taxe:1,
        lib_type: 'Permis de prospection',
        code_type: 'PPM',
        regime: 'mine',
        duree_initiale: 3,
        nbr_renouv_max: 2,
        duree_renouv: 1/2,
        delai_renouv: 90,
        superficie_max: 100
      },
      {
        id_taxe:2,
        lib_type: 'Permis d\'exploration',
        code_type: 'PEM',
        regime: 'mine',
        duree_initiale: 5,
        nbr_renouv_max: 1,
        duree_renouv: 2,
        delai_renouv: 180,
        superficie_max: 500
      },
      {
        id_taxe:3,
        lib_type: 'Permis d\'exploitation',
        code_type: 'PXM',
        regime: 'mine',
        duree_initiale: 25,
        nbr_renouv_max: 3,
        duree_renouv: 10,
        delai_renouv: 365,
        superficie_max: 1000
      },
      {
        id_taxe:4,
        lib_type: 'Permis de petite mine',
        code_type: 'PPM',
        regime: 'mine',
        duree_initiale: 10,
        nbr_renouv_max: 2,
        duree_renouv: 0,
        delai_renouv: 180,
        superficie_max: 50
      },
      
      // Quarry Permits
      {
        id_taxe:5,
        lib_type: 'Permis de recherche carrière',
        code_type: 'PRC',
        regime: 'carriere',
        duree_initiale: 3,
        nbr_renouv_max: 1,
        duree_renouv: 10,
        delai_renouv: 90,
        superficie_max: 50
      },
      {
        id_taxe:6,
        lib_type: 'Permis d\'exploitation carrière',
        code_type: 'PEC',
        regime: 'carriere',
        duree_initiale: 15,
        nbr_renouv_max: 2,
        duree_renouv: 4,
        delai_renouv: 180,
        superficie_max: 100
      },
      
      // Artisanal Permits
      {
        id_taxe:7,
        lib_type: 'Autorisation artisanale mine',
        code_type: 'ARM',
        regime: 'mine',
        duree_initiale: 2,
        nbr_renouv_max: 3,
        duree_renouv: 0,
        delai_renouv: 60,
        superficie_max: 5
      },
      {
        id_taxe:8,
        lib_type: 'Autorisation artisanale carrière',
        code_type: 'ARC',
        regime: 'carriere',
        duree_initiale: 2,
        nbr_renouv_max: 3,
        duree_renouv: 0,
        delai_renouv: 60,
        superficie_max: 2
      },
      
      // Special Permits
      {
        id_taxe:9,
        lib_type: 'Permis de ramassage',
        code_type: 'PRA',
        regime: 'mine',
        duree_initiale: 1,
        nbr_renouv_max: 5,
        duree_renouv: 0,
        delai_renouv: 30,
        superficie_max: null
      },
      {
        id_taxe:10,
        lib_type: 'Permis de transport',
        code_type: 'PTM',
        regime: 'mine',
        duree_initiale: 5,
        nbr_renouv_max: 5,
        duree_renouv: 0,
        delai_renouv: 90,
        superficie_max: null
      }
    ],
    skipDuplicates: true
  });


  // First create BaremProduitetDroit entries
  await prisma.baremProduitetDroit.createMany({
    data: [
      // Mining Prospection
      { id: 1, montant_droit_etab: 30000, produit_attribution: 0 , typePermisId: 1, typeProcedureId: 1},
      // Mining Exploration
      { id: 2, montant_droit_etab: 50000, produit_attribution: 0  , typePermisId: 1, typeProcedureId: 2},
      // Mining Exploitation
      { id: 3, montant_droit_etab: 75000, produit_attribution: 1500000  , typePermisId: 1, typeProcedureId: 1},
      // Small Mine
      { id: 4, montant_droit_etab: 40000, produit_attribution: 1500000  , typePermisId: 1, typeProcedureId: 1},
      // Quarry Research
      { id: 5, montant_droit_etab: 100000, produit_attribution: 3000000 , typePermisId: 1, typeProcedureId: 1 },
      // Quarry Exploitation
      { id: 6, montant_droit_etab: 100000, produit_attribution: 3000000  , typePermisId: 1, typeProcedureId: 1},
      // Artisanal Mine
      { id: 7, montant_droit_etab: 40000, produit_attribution: 1500000 , typePermisId: 1, typeProcedureId: 1 },
      // Artisanal Quarry
      { id: 8, montant_droit_etab: 40000, produit_attribution: 3000000  , typePermisId: 1, typeProcedureId: 1},
      // Collection Permit
      { id: 9, montant_droit_etab: 30000, produit_attribution: 0  , typePermisId: 1, typeProcedureId: 1},
      // Transport Permit
      { id: 10, montant_droit_etab: 0, produit_attribution: 0 , typePermisId: 1, typeProcedureId: 1 }
    ],
    skipDuplicates: true
  });

  // Create SuperficiaireBareme entries


  // Create TypePaiement entries
  await prisma.typePaiement.createMany({
    data: [
      {
        libelle: 'Produit d\'attribution',
        frequence: 'Unique',
        details_calcul: 'Montant fixe selon le type de permis'
      },
      {
        libelle: 'Droit d\'établissement',
        frequence: 'Unique',
        details_calcul: 'Montant fixe selon le type de permis et la procédure'
      },
      {
        libelle: 'Taxe superficiaire',
        frequence: 'Annuel',
        details_calcul: '(Droit fixe + (Droit proportionnel * superficie)) * 12 / 5'
      },
      {
        libelle: 'Redevance minière',
        frequence: 'Annuel',
        details_calcul: 'Pourcentage de la production'
      },
      {
        libelle: 'Frais de dossier',
        frequence: 'Unique',
        details_calcul: 'Montant fixe'
      }
    ],
    skipDuplicates: true
  });

  console.log('Payment data seeded successfully');


  // Get procedure types
  const types = await prisma.typeProcedure.findMany();
  
  // Create phases for each procedure type
  const phasesData = [
    // Demande phases
    { libelle: "Enregistrement de la demande", ordre: 1, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    { libelle: "Vérification cadastrale", ordre: 2, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    { libelle: "Enquete Wali", ordre: 3, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    { libelle: "Comité de direction", ordre: 4, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    { libelle: "Génération du permis", ordre: 5, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    { libelle: "Finalisation", ordre: 6, typeProcedureId: types.find(t => t.libelle === "demande")?.id },
    
    // Renouvellement phases (simpler workflow)
    { libelle: "Soumission", ordre: 1, typeProcedureId: types.find(t => t.libelle === "renouvellement")?.id },
    { libelle: "Vérification", ordre: 2, typeProcedureId: types.find(t => t.libelle === "renouvellement")?.id },
    { libelle: "Approbation", ordre: 3, typeProcedureId: types.find(t => t.libelle === "renouvellement")?.id },
    
    // Add phases for other types as needed...
  ];

  await prisma.phase.createMany({
    data: phasesData.filter(p => p.typeProcedureId !== undefined),
    skipDuplicates: true
  });

  console.log("✅ Phases créées pour chaque type de procédure.");

  // Create etapes for each phase
  const etapesData = [
    // Demande - Phase 1 etapes
    { id_etape: 1, lib_etape: "Documents", ordre_etape: 1, id_phase: 1 },
      { id_etape: 2, lib_etape: "Identification", ordre_etape: 2, id_phase: 1 },
      { id_etape: 3, lib_etape: "Capacités", ordre_etape: 3, id_phase: 1 },
      { id_etape: 4, lib_etape: "Substances & Travaux", ordre_etape: 4, id_phase: 1 },

      // Phase 2
      { id_etape: 5, lib_etape: "Cadastre", ordre_etape: 5, id_phase: 2 },

      // Phase 3
      { id_etape: 6, lib_etape: "Avis Wali", ordre_etape: 6, id_phase: 3 },

      // Phase 4
      { id_etape: 7, lib_etape: "Comité de direction", ordre_etape: 7, id_phase: 4 },

      // Phase 5
      { id_etape: 8, lib_etape: "Génération du permis", ordre_etape: 8, id_phase: 5 },

      // Phase 6
      { id_etape: 9, lib_etape: "Paiement", ordre_etape: 9, id_phase: 6 },
  ];

  await prisma.etapeProc.createMany({
    data: etapesData,
    skipDuplicates: true
  });

  console.log("✅ Étapes créées pour chaque phase.");
}


main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());