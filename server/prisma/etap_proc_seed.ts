// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// seed.ts
async function main() {
 
  

// await prisma.typeProcedure.createMany({
//     data: [
//       // Initial Requests
//       { libelle: 'demande', description: 'Demande initiale de permis' },
//       { libelle: 'renouvellement', description: 'Renouvellement de permis' },
      
//       // Modifications
//       { libelle: 'extension', description: 'Extension de superficie ou durée' },
//       { libelle: 'modification', description: 'Modification des conditions' },
//       { libelle: 'fusion', description: 'Fusion de permis' },
//       { libelle: 'division', description: 'Division de permis' },
      
//       // Transfers
//       { libelle: 'transfert', description: 'Transfert de droits' },
//       { libelle: 'cession', description: 'Cession partielle' },
      
//       // Termination
//       { libelle: 'renonciation', description: 'Renonciation au permis' },
//       { libelle: 'retrait', description: 'Retrait administratif' },
      
//       // Special Procedures
//       { libelle: 'regularisation', description: 'Procédure de régularisation' },
//       { libelle: 'recours', description: 'Recours administratif' },
//       { libelle: 'arbitrage', description: 'Demande d\'arbitrage' }
//     ],
//     skipDuplicates: true
//   });

//   console.log('Seed data created successfully');
  // console.log(`Created ${typePermis.count} TypePermis entries`);
  // console.log(`Created ${typeProcedures.count} TypeProcedure entries`);
 

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