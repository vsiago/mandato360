import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function migrate() {
    console.log('Adding is_demo and claimed columns...');
    try {
        await sql.unsafe('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;');
        await sql.unsafe('ALTER TABLE tenants ADD COLUMN IF NOT EXISTS claimed BOOLEAN DEFAULT FALSE;');
        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await sql.end();
    }
}

migrate();
