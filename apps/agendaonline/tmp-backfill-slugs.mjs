import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const envPath = path.join(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = env.match(/DATABASE_URL=(.*)/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].replace(/['"]/g, '').trim() : null;

if (!dbUrl) throw new Error("No DATABASE_URL found");

const sql = postgres(dbUrl);

async function run() {
    try {
        console.log("Adding slug column to services table...");
        await sql`ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT;`;
        
        console.log("Backfilling slugs...");
        const services = await sql`SELECT id, name FROM services WHERE slug IS NULL OR slug = '';`;
        
        for (const s of services) {
            const slug = s.name.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with -
                .replace(/^-+|-+$/g, ""); // trim -
            
            await sql`UPDATE services SET slug = ${slug} WHERE id = ${s.id};`;
            console.log(`Updated: ${s.name} -> ${slug}`);
        }
        
        // Make slug NOT NULL after backfill
        await sql`ALTER TABLE services ALTER COLUMN slug SET NOT NULL;`;
        console.log("Schema updated and backfilled successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
