import { db } from "../db";
import { tenants, user } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const t = await db.query.tenants.findFirst({
        where: eq(tenants.slug, "jaque-geovanelle")
    });
    if (t && t.ownerId) {
        const u = await db.query.user.findFirst({
            where: eq(user.id, t.ownerId)
        });
        console.log(`Owner of jaque-geovanelle: ${u?.email} (${u?.id})`);
    } else {
        console.log("Tenant or owner not found.");
    }
}

main().catch(console.error);
