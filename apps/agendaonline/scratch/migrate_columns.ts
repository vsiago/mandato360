
import postgres from "postgres";

const sql = postgres("postgresql://postgres.briejkjgsecnzrgestlw:Iaaa81510156!!!@aws-0-us-west-2.pooler.supabase.com:6543/postgres");

async function run() {
  console.log("Adding columns to tenants table...");
  try {
    await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS design_system jsonb;`;
    await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS config jsonb;`;
    console.log("Columns added successfully!");
  } catch (err) {
    console.error("Error adding columns:", err);
  } finally {
    await sql.end();
  }
}

run();
