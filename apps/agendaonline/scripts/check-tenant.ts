import postgres from "postgres";
import "dotenv/config";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function checkTenant() {
    try {
        const res = await sql`
            SELECT t.name, t.slug, bt.name as business_type, t.id
            FROM tenants t 
            JOIN business_types bt ON t.business_type_id = bt.id 
            WHERE t.slug = 'iago-barber'
        `;
        console.log("Tenant Info:", JSON.stringify(res, null, 2));

        if (res.length > 0) {
            const tenantId = res[0].id;
            const svcs = await sql`SELECT name, image FROM services WHERE tenant_id = ${tenantId}`;
            console.log("Services:", JSON.stringify(svcs, null, 2));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
        process.exit();
    }
}

checkTenant();
