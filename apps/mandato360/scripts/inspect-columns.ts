import "dotenv/config";
import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function inspectColumns() {
    try {
        console.log("Inspecting columns of 'session' table...");
        const result = (await db.execute(sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'session'
        `)) as unknown as any[];
        
        console.log("Columns:", result.map(c => `${c.column_name} (${c.data_type})`));
    } catch (error) {
        console.error("Inspection failed:", error);
    } finally {
        process.exit();
    }
}

inspectColumns();
