import { execSync } from 'child_process';

const run = (cmd: string) => {
  console.log(`▶ Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

try {
  // ❗ DANGER: This will drop the database, reapply all migrations, and re-seed from scratch
  // run('npx prisma migrate reset --force');

  // Now run custom seeders if not handled automatically by migrate reset
  run('npx ts-node prisma/seed_paiment.ts');
  run('npx ts-node prisma/seed.ts');
  run('npx ts-node prisma/TableRef/superficiaireBareme_seed.ts');
  run('npx ts-node prisma/TableRef/typeProcedure_seed.ts');
  run('npx ts-node prisma/TableRef/pays_seed.ts');
  run('npx ts-node prisma/TableRef/nationalite_seed.ts');
  run('npx ts-node prisma/TableRef/antenne_seed.ts');
  run('npx ts-node prisma/TableRef/wilaya_seed.ts');
  run('npx ts-node prisma/TableRef/daira_seed.ts');
  run('npx ts-node prisma/TableRef/commune_seed.ts');
  run('npx ts-node prisma/TableRef/statutJuridique_seed.ts');
  run('npx ts-node prisma/TableRef/expert_seed.ts');
  run('npx ts-node prisma/seed_statutpermis.ts');
  run('npx ts-node prisma/TableRef/role_seed.ts');
  run('npx ts-node prisma/TableRef/dftypepermis_seed.ts');
  run('npx ts-node prisma/TableRef/substances_seed.ts');
  run('npx ts-node prisma/TableRef/phase_seed.ts');
  run('npx ts-node prisma/TableRef/combinaisonPermisProc_seed.ts');
  run('npx ts-node prisma/TableRef/relationPhaseTypeProc_seed.ts');
  // run('npx ts-node prisma/etap_proc_seed.ts');
  run('npx ts-node prisma/Procedure/phases_seed.ts');
  run('npx ts-node prisma/Procedure/EtapeProc_seed.ts');
  run('npx ts-node prisma/Procedure/procedure_seed.ts');
  run('npx ts-node prisma/Procedure/substanceAssocieDemande_seed.ts');
  run('npx ts-node prisma/Procedure/procedurePhaseEtapes_seed.ts');
  run('npx ts-node prisma/Procedure/interactionWali_seed.ts');
  run('npx ts-node prisma/seed_documents.ts');
  run('npx ts-node prisma/Demande/demandeGeneral_seed.ts');
  run('npx ts-node prisma/Demande/demAnnulation_seed.ts');
  run('npx ts-node prisma/Demande/demInitial_seed.ts');
  run('npx ts-node prisma/Demande/demModification_seed.ts');
  run('npx ts-node prisma/Demande/demRenonciation_seed.ts');
  run('npx ts-node prisma/Demande/demRenouvellement_seed.ts');
  run('npx ts-node prisma/Demande/demTransfer_seed.ts');
  run('npx ts-node prisma/Demande/demandeMin_seed.ts');
  run('npx ts-node prisma/Demande/demandeVerificationGeo_seed.ts');

  // After all seeds, resynchronise all PostgreSQL sequences with the current data
  run('npx ts-node prisma/sync_sequences.ts');

  //run('npx ts-node prisma/seed_pays.ts');

  console.log('✅ Database reset and all seeds executed successfully!');
} catch (e) {
  console.error('❌ Error while running reset or seeds', e);
  process.exit(1);
}
