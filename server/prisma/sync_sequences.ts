import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeqInfo = {
  table_name: string;
  column_name: string;
  sequence_name: string;
};

async function syncAllSequences() {
  console.log("🔍 Detecting all sequences...");

  // This query finds ALL sequences linked to table columns (NOT dependent on depType)
  const seqs = await prisma.$queryRawUnsafe<SeqInfo[]>(`
    SELECT
      t.relname AS table_name,
      a.attname AS column_name,
      s.relname AS sequence_name
    FROM pg_class s
    JOIN pg_depend d ON d.objid = s.oid
    JOIN pg_class t ON d.refobjid = t.oid
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = d.refobjsubid
    WHERE s.relkind = 'S'          -- only sequences
      AND d.classid = 'pg_class'::regclass; -- ensure dependency is table-level
  `);

  console.log(`🔧 Found ${seqs.length} sequences to fix.\n`);

  for (const seq of seqs) {
    const { table_name, column_name, sequence_name } = seq;

    // Build SQL (with proper quoted identifiers)
    const sql = `
      SELECT setval(
        '"${sequence_name}"',
        COALESCE((SELECT MAX("${column_name}") FROM "${table_name}"), 0) + 1,
        false
      );
    `;

    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(
        `✔ Synced ${sequence_name} → ${table_name}.${column_name}`
      );
    } catch (err) {
      console.error(
        `❌ Failed syncing sequence ${sequence_name}: ${(err as Error).message}`
      );
    }
  }

  console.log("\n✅ All sequences synchronized successfully!");
}

async function main() {
  try {
    console.log("🚀 Starting global sequence synchronization...");
    await syncAllSequences();
  } catch (err) {
    console.error("❌ Fatal error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
