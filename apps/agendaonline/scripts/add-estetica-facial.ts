import { db } from "../db/index.js";
import { tenants, categories, services } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

async function main() {
    const slug = "espao-la-belle";
    
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    });

    if (!tenant) {
        console.error("Tenant not found:", slug);
        process.exit(1);
    }

    // Find the Estética Facial category
    const category = await db.query.categories.findFirst({
        where: and(
            eq(categories.tenantId, tenant.id),
            eq(categories.label, "Estética Facial")
        )
    });

    if (!category) {
        console.error("Category 'Estética Facial' not found for tenant");
        process.exit(1);
    }

    // Insert a new service
    const newServiceId = crypto.randomUUID();
    await db.insert(services).values({
        id: newServiceId,
        tenantId: tenant.id,
        categoryId: category.id,
        name: "Limpeza de Pele Profunda",
        slug: "limpeza-de-pele-profunda",
        duration: 60,
        price: "120.00",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
        description: "Remoção de impurezas, cravos e células mortas para uma pele renovada.",
        isActive: true
    });

    console.log("Added Limpeza de Pele Profunda to Estética Facial.");
    process.exit(0);
}

main().catch(console.error);
