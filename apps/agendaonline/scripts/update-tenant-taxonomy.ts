import postgres from "postgres";
import "dotenv/config";
import crypto from "crypto";

const sql = postgres(process.env.DATABASE_URL!, { ssl: "require" });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

async function updateTenant(slug: string) {
    console.log(`🔄 Updating tenant: ${slug}...`);
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

        // 2. Get current tenant categories and services
        const tenantCats = await sql`SELECT * FROM categories WHERE tenant_id = ${t.id}`;
        const tenantSvcs = await sql`SELECT * FROM services WHERE tenant_id = ${t.id}`;

        // 3. Upsert categories
        const catMap: Record<string, string> = {};
        for (const gc of globalCats) {
            const existingCat = tenantCats.find(c => c.slug === gc.slug || c.label === gc.name);
            
            if (existingCat) {
                console.log(`   📁 Updating Category: ${gc.name}`);
                await sql`
                    UPDATE categories 
                    SET label = ${gc.name}, sort_order = ${gc.sort_order}
                    WHERE id = ${existingCat.id}
                `;
                catMap[gc.id] = existingCat.id;
            } else {
                console.log(`   📁 Adding Category: ${gc.name}`);
                const newId = crypto.randomUUID();
                const [newCat] = await sql`
                    INSERT INTO categories (id, tenant_id, label, slug, sort_order)
                    VALUES (${newId}, ${t.id}, ${gc.name}, ${gc.slug}, ${gc.sort_order})
                    RETURNING id
                `;
                catMap[gc.id] = newCat.id;
            }
        }

        // 4. Upsert services
        for (const gs of globalSvcs) {
            const existingSvc = tenantSvcs.find(s => s.slug === gs.slug || s.name === gs.name);
            const categoryId = catMap[gs.global_category_id];

            if (existingSvc) {
                console.log(`      🔹 Updating Service: ${gs.name}`);
                await sql`
                    UPDATE services 
                    SET 
                        image = ${gs.image},
                        description = ${gs.default_description},
                        price = COALESCE(price, ${gs.default_price}),
                        duration = COALESCE(duration, ${gs.default_duration}),
                        sort_order = ${gs.sort_order},
                        category_id = ${categoryId}
                    WHERE id = ${existingSvc.id}
                `;
            } else {
                console.log(`      🔹 Adding Service: ${gs.name}`);
                const newId = crypto.randomUUID();
                await sql`
                    INSERT INTO services (
                        id, tenant_id, category_id, name, slug, description, image, price, duration, sort_order, is_active
                    )
                    VALUES (
                        ${newId},
                        ${t.id}, 
                        ${categoryId}, 
                        ${gs.name}, 
                        ${gs.slug},
                        ${gs.default_description}, 
                        ${gs.image}, 
                        ${gs.default_price}, 
                        ${gs.default_duration}, 
                        ${gs.sort_order}, 
                        true
                    )
                `;
            }
        }

        console.log(`✅ Tenant ${slug} updated successfully with premium images and data!`);
    } catch (e) {
        console.error("❌ Error updating tenant:", e);
    } finally {
        await sql.end();
        process.exit();
    }
}

const targetSlug = process.argv[2];
if (!targetSlug) {
    console.error("Usage: npx tsx scripts/update-tenant-taxonomy.ts <tenant-slug>");
    process.exit(1);
}
updateTenant(targetSlug);
