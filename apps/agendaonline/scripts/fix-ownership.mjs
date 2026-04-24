import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

// Show all users
const users = await sql`SELECT id, name, email FROM "user"`;
console.log('=== All Users ===');
for (const u of users) {
    console.log(`  ${u.id} | ${u.name} | ${u.email}`);
}

// Show all tenants
const tenants = await sql`SELECT id, slug, name, owner_id FROM tenants`;
console.log('\n=== All Tenants ===');
for (const t of tenants) {
    console.log(`  ${t.id} | ${t.slug} | ${t.name} | owner: ${t.owner_id}`);
}

// Fix: assign tenant to the user "Marie" if she doesn't have one
const marie = users.find(u => u.email && u.email.includes('marie'));
const iago = users.find(u => u.name && u.name.toLowerCase().includes('iago'));
const targetUser = marie || iago || users[users.length - 1];

if (targetUser && tenants.length > 0) {
    const tenant = tenants[0];
    if (tenant.owner_id !== targetUser.id) {
        console.log(`\nUpdating tenant "${tenant.slug}" owner from ${tenant.owner_id} to ${targetUser.id} (${targetUser.name})`);
        await sql`UPDATE tenants SET owner_id = ${targetUser.id} WHERE id = ${tenant.id}`;
        console.log('Done!');
    } else {
        console.log(`\nTenant already owned by ${targetUser.name}`);
    }
}

await sql.end();
