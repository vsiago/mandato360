import 'dotenv/config';
import { db } from './lib/db';
import { sql } from 'drizzle-orm';

async function verify() {
  const result = await db.execute(sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'session'`);
  console.log("Columns in 'session' table:", result.map((r: any) => r.column_name));
  process.exit(0);
}

verify();
