import 'dotenv/config';
import postgres from 'postgres';

async function run() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set");
        process.exit(1);
    }

    const sql = postgres(process.env.DATABASE_URL);
    try {
        console.log('Adding banned column...');
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" boolean;`;
        console.log('Adding ban_reason column...');
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_reason" text;`;
        console.log('Adding ban_expires column...');
        await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_expires" timestamp;`;
        console.log('✅ Columns added successfully.');
    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

run();
