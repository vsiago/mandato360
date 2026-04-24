import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Check existing columns
const existing = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tenants' ORDER BY ordinal_position`;
const cols = existing.map(c => c.column_name);
console.log('Existing columns:', cols.join(', '));

const toAdd = [
    { name: 'hero_badge', type: 'TEXT' },
    { name: 'hero_headline', type: 'TEXT' },
    { name: 'hero_highlight', type: 'TEXT' },
    { name: 'cta_text', type: "TEXT DEFAULT 'Agendar Horário'" },
    { name: 'section_styles', type: 'JSONB' },
    { name: 'responsive_overrides', type: 'JSONB' },
    { name: 'chat', type: 'JSONB' },
    { name: 'onboarding_completed', type: 'BOOLEAN NOT NULL DEFAULT false' },
];

for (const col of toAdd) {
    if (cols.includes(col.name)) {
        console.log(`  OK ${col.name} already exists`);
    } else {
        try {
            await sql.unsafe(`ALTER TABLE tenants ADD COLUMN ${col.name} ${col.type}`);
            console.log(`  + Added ${col.name}`);
        } catch (e) {
            console.error(`  X Error adding ${col.name}:`, e.message);
        }
    }
}

console.log('\nDone!');
await sql.end();
