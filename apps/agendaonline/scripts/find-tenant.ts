import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function findTenant() {
    console.log("Searching for a working tenant...");
    try {
        const tenants = await sql`SELECT * FROM tenants LIMIT 5`;
        if (tenants.length === 0) {
            console.log("No tenants found in the database.");
            return;
        }

        for (const tenant of tenants) {
            console.log(`\n--- Tenant found: ${tenant.name} (${tenant.slug}) ---`);
            const svcs = await sql`SELECT count(*) as c FROM services WHERE tenant_id = ${tenant.id}`;
            const cats = await sql`SELECT count(*) as c FROM categories WHERE tenant_id = ${tenant.id}`;
            console.log(`Services: ${svcs[0].c}`);
            console.log(`Categories: ${cats[0].c}`);
            console.log(`Onboarding Completed: ${tenant.onboardingCompleted}`);
            console.log(`URL: http://localhost:3002/${tenant.slug}`);
        }
    } catch (e) {
        console.error("❌ Error:", e);
    } finally {
        await sql.end();
        process.exit(0);
    }
}

findTenant();
