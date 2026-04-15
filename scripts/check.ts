import { db } from "./lib/db/index";
import { session } from "./lib/db/schema";
import { desc } from "drizzle-orm";

async function run() {
    const sessions = await db.select().from(session).orderBy(desc(session.createdAt)).limit(5);
    console.log("Recent sessions:", sessions);
    process.exit(0);
}
run();
