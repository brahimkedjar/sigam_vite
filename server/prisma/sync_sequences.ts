import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SequenceRow = {
  table_name: string;
  column_name: string;
  sequence_name: string;
};

async function syncAllSequences() {
  // Find all sequences attached to table columns in the public schema
  const rows = await prisma.$queryRawUnsafe<SequenceRow[]>(`
    SELECT
      t.relname AS table_name,
      a.attname AS column_name,
      s.relname AS sequence_name
    FROM pg_class t
    JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum > 0
    JOIN pg_depend d ON d.refobjid = t.oid AND d.refobjsubid = a.attnum
    JOIN pg_class s ON s.oid = d.objid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE d.deptype = 'a'
      AND n.nspname = 'public';
  `);

  for (const row of rows) {
    const { table_name, column_name, sequence_name } = row;
    // Move the sequence to max(id)+1 for that table/column.
    // Wrap each update in a try/catch so that any stale or missing
    // sequence entry does not break the whole sync.
    const sql = `
      SELECT setval(
        '${sequence_name}',
        COALESCE((SELECT MAX("${column_name}") FROM "${table_name}"), 0) + 1,
        false
      );
    `;
    try {
      await prisma.$executeRawUnsafe(sql);
    } catch (err) {
      console.warn(
        `Skipping sequence sync for ${sequence_name} on ${table_name}.${column_name}:`,
        (err as Error).message ?? err,
      );
    }
  }
}

async function main() {
  console.log('Synchronising PostgreSQL sequences with current data...');
  await syncAllSequences();
  console.log('Sequences synchronised successfully.');
}

main()
  .catch((error) => {
    console.error('Error while synchronising sequences', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
