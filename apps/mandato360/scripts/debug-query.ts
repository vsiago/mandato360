import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function debugQuery() {
    try {
        console.log("Running debug query on 'session' table...");
        const result = await db.execute(sql`SELECT * FROM "session" LIMIT 1`);
        console.log("Query success!", result);
    } catch (error: any) {
        console.error("Query failed with error:");
        console.error(error);
        if (error.message) console.error("Message:", error.message);
        if (error.detail) console.error("Detail:", error.detail);
        if (error.hint) console.error("Hint:", error.hint);
    } finally {
        process.exit();
    }
}

debugQuery();
