import { db } from "../db";
import { tenants, businessTypes } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    // We'll look for the tenant with slug "jaque-geovanelle" or similar, 
    // but the user is at http://localhost:3002/servicos which is the dashboard of the logged in user.
    // Let's just find the first tenant and see its businessTypeId.
    
    const t = await db.query.tenants.findFirst();
    console.log("Tenant:", JSON.stringify(t, null, 2));
    
    if (t?.businessTypeId) {
        const bt = await db.query.businessTypes.findFirst({
            where: eq(businessTypes.id, t.businessTypeId)
        });
        console.log("Business Type:", JSON.stringify(bt, null, 2));
    }
}

main().catch(console.error);
