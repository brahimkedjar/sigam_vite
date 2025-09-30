import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.statutPermis.createMany({
    data: [
      {
        lib_statut: 'En vigueur',
        description: 'Le permis est actuellement En vigueur',
      },
      {
        lib_statut: 'Suspendu',
        description: 'Le permis est temporairement suspendu',
      },
      {
        lib_statut: 'Annulé',
        description: 'Le permis a été annulé',
      },
      {
        lib_statut: 'Renoncé',
        description: 'Le titulaire a renoncé au permis',
      },
      {
        lib_statut: 'Expirée',
        description: 'Le permis est arrivé à son terme',
      },
    ],
    skipDuplicates: true, // évite les erreurs si déjà inséré
  });

  console.log('✅ Statuts de permis insérés avec succès');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
