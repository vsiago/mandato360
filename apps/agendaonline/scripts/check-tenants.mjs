import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
const r = await sql`SELECT id, slug, name, owner_id, onboarding_completed FROM tenants`;
console.log(JSON.stringify(r, null, 2));
await sql.end();
