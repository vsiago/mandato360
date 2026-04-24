import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Find the user
const users = await sql`SELECT id, name, email FROM "user"`;
console.log('Users:', JSON.stringify(users, null, 2));

if (users.length > 0) {
    const u = users[0];
    console.log(`\nCreating tenant for user: ${u.name} (${u.email})`);

    // Check if tenant already exists
    const existing = await sql`SELECT id, slug FROM tenants WHERE owner_id = ${u.id}`;
    if (existing.length > 0) {
        console.log('Tenant already exists:', existing[0].slug);
    } else {
        const result = await sql`
            INSERT INTO tenants (id, slug, name, business_type_id, description, primary_color, hover_color, 
                phone, whatsapp, address, instagram, onboarding_completed, owner_id)
            VALUES (
                ${crypto.randomUUID()},
                'agenda-studio',
                ${u.name || 'Studio Beleza'},
                'bt-salao-de-beleza',
                'Seu espaço de beleza e bem-estar',
                '#8c6239',
                '#6d4a2a',
                '',
                '',
                '',
                '',
                true,
                ${u.id}
            )
            RETURNING id, slug, name
        `;
        console.log('Created tenant:', JSON.stringify(result[0], null, 2));
    }
}

await sql.end();
