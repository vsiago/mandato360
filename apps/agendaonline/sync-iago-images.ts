import { db } from "./db/index";
import { services, tenants } from "./db/schema";
import { eq } from "drizzle-orm";
import { getNicheServices } from "./lib/tenant-defaults";

async function syncImages() {
    const tenant = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "iago")
    });

    if (!tenant) return;

    const defaultServices = getNicheServices("Barbearia");

    for (const s of defaultServices) {
        console.log(`Searching for service with slug: ${s.slug}`);
        const dbService = await db.query.services.findFirst({
            where: (svc, { and, eq }) => and(
                eq(svc.tenantId, tenant.id),
                eq(svc.slug, s.slug)
            )
        });

        if (dbService) {
            console.log(`Updating ${s.name} with image: ${s.image}`);
            await db.update(services)
                .set({ 
                    image: s.image,
                    fullDescription: s.description,
                    features: s.features,
                    addons: s.addons
                })
                .where(eq(services.id, dbService.id));
        }
    }
    console.log("Sync completed");
    process.exit(0);
}

syncImages();
