import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function verify() {
    try {
        console.log("Verifying database connection...");
        const result = (await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`)) as unknown as any[];
        console.log("Tables in database:", result.map(r => r.table_name));
        
        if (result.length === 0) {
            console.error("No tables found in public schema.");
        } else {
            console.log("Connection successful and tables exist!");
        }
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        process.exit();
    }
}

verify();
