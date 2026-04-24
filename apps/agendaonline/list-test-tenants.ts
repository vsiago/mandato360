import { db } from "./db";
import { tenants } from "./db/schema";

async function list() {
  try {
    const list = await db.select({ slug: tenants.slug }).from(tenants);
    console.log("TENANTS:", JSON.stringify(list));
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

list();
