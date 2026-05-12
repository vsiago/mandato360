import { db } from "../db";
import { businessTypes } from "../db/schema";

async function main() {
    const types = await db.select().from(businessTypes);
    types.forEach(t => console.log(`${t.id}: ${t.name}`));
}

main().catch(console.error);
