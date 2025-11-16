// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPaymentData() {

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
}

// Then run your existing seed functions
async function main() {
  await seedPaymentData();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });