import { db } from "../db";
import { account, user } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
    const accounts = await db.select().from(account).limit(5);
    for (const acc of accounts) {
        const u = await db.query.user.findFirst({ where: eq(user.id, acc.userId) });
        console.log(`User: ${u?.email} | Password Hash: ${acc.password}`);
    }
}

main().catch(console.error);
