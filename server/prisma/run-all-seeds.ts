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
  run('npx ts-node prisma/seed_documents.ts');
  //run('npx ts-node prisma/seed_communs.ts');
  run('npx ts-node prisma/seed_substances.ts');
  run('npx ts-node prisma/seed_statutpermis.ts');
    run('npx ts-node prisma/etap_proc_seed.ts');
    run('npx ts-node prisma/role_seed.ts');

  //run('npx ts-node prisma/seed_pays.ts');

  console.log('✅ Database reset and all seeds executed successfully!');
} catch (e) {
  console.error('❌ Error while running reset or seeds', e);
  process.exit(1);
}
