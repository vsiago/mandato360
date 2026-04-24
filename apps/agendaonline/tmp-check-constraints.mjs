import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL);

async function main() {
    try {
        const constraints = await sql`
      SELECT 
        con.conname AS constraint_name,
        rel.relname AS table_name,
        nsp.nspname AS schema_name,
        pg_get_constraintdef(con.oid) AS constraint_def
      FROM pg_constraint con
      INNER JOIN pg_class rel ON rel.oid = con.conrelid
      INNER JOIN pg_namespace nsp ON nsp.oid = con.connamespace
      WHERE con.contype = 'c';
    `;
        const nullDefs = constraints.filter(c => c.constraint_def === null);
        console.log("CHECK constraints with NULL def:", nullDefs.length);
        console.table(nullDefs.slice(0, 10));
    } catch (error) {
        console.error("Error connecting or querying:", error);
    } finally {
        await sql.end();
    }
}

main();
