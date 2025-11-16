// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPaymentData() {



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