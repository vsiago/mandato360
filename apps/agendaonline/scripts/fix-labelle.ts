import { db } from "../db/index.js";
import { tenants, categories, services, globalCategories, globalServices } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";
import crypto from "crypto";

async function main() {
    console.log("Starting script...");
    const slug = "espao-la-belle";
    
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    });

    if (!tenant) {
        console.error("Tenant not found:", slug);
        process.exit(1);
    }
    
    console.log("Found tenant:", tenant.id, tenant.name, "Business Type:", tenant.businessTypeId);

    if (!tenant.businessTypeId) {
        console.error("No business type ID for tenant");
        process.exit(1);
    }

    // 1. Delete existing services and categories for this tenant to start fresh
    console.log("Deleting existing services and categories...");
    await db.delete(services).where(eq(services.tenantId, tenant.id));
    await db.delete(categories).where(eq(categories.tenantId, tenant.id));
    console.log("Deleted.");

    // 2. Fetch global categories for the business type
    const gCats = await db.query.globalCategories.findMany({
        where: eq(globalCategories.businessTypeId, tenant.businessTypeId),
        orderBy: (cats, { asc }) => [asc(cats.sortOrder)]
    });

    console.log(`Found ${gCats.length} global categories.`);

    // 3. Keep only up to 4 categories
    const categoriesToKeep = gCats.slice(0, 4);
    console.log(`Keeping ${categoriesToKeep.length} categories:`, categoriesToKeep.map(c => c.name).join(", "));

    // 4. Fetch global services
    const gSvcs = await db.query.globalServices.findMany({
        where: eq(globalServices.businessTypeId, tenant.businessTypeId),
        orderBy: (svcs, { asc }) => [asc(svcs.sortOrder)]
    });

    console.log(`Found ${gSvcs.length} global services.`);

    // 5. Insert categories and exactly 3 services per category
    for (const gCat of categoriesToKeep) {
        const newCatId = crypto.randomUUID();
        await db.insert(categories).values({
            id: newCatId,
            tenantId: tenant.id,
            label: gCat.name,
            slug: gCat.slug,
            sortOrder: gCat.sortOrder
        });
        
        console.log(`Created category: ${gCat.name} (${newCatId})`);

        // Find services for this category
        const svcsForCat = gSvcs.filter(s => s.globalCategoryId === gCat.id);
        
        // Take up to 3 services
        const svcsToInsert = svcsForCat.slice(0, 3);
        
        console.log(`  Found ${svcsForCat.length} services, inserting ${svcsToInsert.length}`);
        
        for (const gSvc of svcsToInsert) {
            await db.insert(services).values({
                tenantId: tenant.id,
                categoryId: newCatId,
                name: gSvc.name,
                slug: gSvc.slug,
                duration: gSvc.defaultDuration,
                price: gSvc.defaultPrice?.toString() || "0",
                image: gSvc.image,
                description: gSvc.defaultDescription,
                isActive: true
            });
            console.log(`  Inserted service: ${gSvc.name}`);
        }
    }

    console.log("Done!");
    process.exit(0);
}

main().catch(console.error);
