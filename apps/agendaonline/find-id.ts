import { db } from "./db"
import { tenants } from "./db/schema"
import { eq } from "drizzle-orm"

async function findId() {
  const t = await db.query.tenants.findFirst({
    where: eq(tenants.slug, "studio-jaque-geovanelle")
  })
  console.log("Tenant ID:", t?.id)
  process.exit(0)
}

findId()
