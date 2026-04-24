import { db } from "./db"
import { tenants } from "./db/schema"
import { eq } from "drizzle-orm"

async function test() {
    const allTenants = await db.query.tenants.findMany()
    console.log("Tenants found:", allTenants.map(t => ({ id: t.id, slug: t.slug, createdAt: t.createdAt })))
    
    // Pick the first one and expire its trial (set createdAt to 10 days ago)
    if (allTenants.length > 0) {
        const target = allTenants[0]
        const tenDaysAgo = new Date()
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)
        
        await db.update(tenants)
            .set({ createdAt: tenDaysAgo })
            .where(eq(tenants.id, target.id))
        
        console.log(`Updated tenant ${target.slug} to be expired.`)
    }
}

test().catch(console.error)
