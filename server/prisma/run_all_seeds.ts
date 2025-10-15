import { PrismaClient } from '@prisma/client';
import * as antenneSeed from './antenne_seed';
import * as wilayaSeed from './wilaya_seed';
import * as dairaSeed from './daira_seed';
import * as communeSeed from './commune_seed';
import * as paysSeed from './pays_seed';
import * as nationaliteSeed from './nationalite_seed';
import * as expertSeed from './expert_seed';
import * as statutJuridiqueSeed from './statutJuridique_seed';
import * as detenteurSeed from './detenteur_seed';
import * as registreSeed from './registre_seed';
// import * as demandeSeed from './demande_seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  // Liste des scripts de seed dans l'ordre
  const seeds = [
    { name: 'antenne_seed', run: antenneSeed.main },
    { name: 'wilaya_seed', run: wilayaSeed.main },
    { name: 'daira_seed', run: dairaSeed.main },
    { name: 'commune_seed', run: communeSeed.main },
    { name: 'pays_seed', run: paysSeed.main },
    { name: 'nationalite_seed', run: nationaliteSeed.main },
    { name: 'expert_seed', run: expertSeed.main },
    { name: 'statutJuridique_seed', run: statutJuridiqueSeed.main },
    { name: 'detenteur_seed', run: detenteurSeed.main },
    { name: 'registre_seed', run: registreSeed.main },
    // { name: 'demande_seed', run: demandeSeed.main },
  ];

  for (const seed of seeds) {
    console.log(`Running ${seed.name}...`);
    try {
      await seed.run();
      console.log(`${seed.name} completed successfully.`);
    } catch (error) {
      console.error(`Error in ${seed.name}:`, error);
      throw error; 
    }
  }

  console.log('All seeds completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
