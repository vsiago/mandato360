import postgres from "postgres";
import "dotenv/config";
import crypto from "crypto";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

async function syncTenant(slug: string) {
    console.log(`🔄 Syncing tenant: ${slug}...`);
    try {
        const tenant = await sql`SELECT * FROM tenants WHERE slug = ${slug}`;
        if (tenant.length === 0) {
            console.error("❌ Tenant not found.");
            return;
        }

        const t = tenant[0];
        const businessTypeId = t.business_type_id;

        if (!businessTypeId) {
            console.error("❌ Tenant has no business type id.");
            return;
        }

        // 1. Get global categories and services for this business type
        const globalCats = await sql`SELECT * FROM global_categories WHERE business_type_id = ${businessTypeId}`;
        const globalSvcs = await sql`SELECT * FROM global_services WHERE business_type_id = ${businessTypeId}`;

        console.log(`Found ${globalCats.length} global categories and ${globalSvcs.length} global services.`);

        // 2. Clean up current tenant categories and services
        await sql`DELETE FROM services WHERE tenant_id = ${t.id}`;
        await sql`DELETE FROM categories WHERE tenant_id = ${t.id}`;

        // 3. Insert new categories
        const catMap: Record<string, string> = {};
        for (const gc of globalCats) {
            const newId = crypto.randomUUID();
            const [newCat] = await sql`
                INSERT INTO categories (id, tenant_id, label, slug, sort_order)
                VALUES (${newId}, ${t.id}, ${gc.name}, ${gc.slug}, ${gc.sort_order})
                RETURNING id
            `;
            catMap[gc.id] = newCat.id;
        }

        // 4. Insert new services
        for (const gs of globalSvcs) {
            const newId = crypto.randomUUID();
            await sql`
                INSERT INTO services (
                    id, tenant_id, category_id, name, description, image, price, duration, sort_order, is_active
                )
                VALUES (
                    ${newId},
                    ${t.id}, 
                    ${catMap[gs.global_category_id]}, 
                    ${gs.name}, 
                    ${gs.default_description}, 
                    ${gs.image}, 
                    ${gs.default_price}, 
                    ${gs.default_duration}, 
                    ${gs.sort_order}, 
                    true
                )
            `;
        }

        console.log(`✅ Tenant ${slug} synced successfully with 3x3 taxonomy and images!`);
    } catch (e) {
        console.error("❌ Error syncing tenant:", e);
    } finally {
        await sql.end();
        process.exit();
    }
}

const targetSlug = process.argv[2] || "iago-barber";
syncTenant(targetSlug);
