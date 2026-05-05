import "dotenv/config";
import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Adding custom_fields to appointments...");
    try {
        await db.execute(sql`ALTER TABLE "appointments" ADD COLUMN "custom_fields" jsonb DEFAULT '{}'::jsonb`);
        console.log("Column added successfully.");
    } catch (e: any) {
        if (e.message?.includes("already exists")) {
            console.log("Column already exists.");
        } else {
            console.error("Error adding column:", e);
        }
    }
    process.exit(0);
}

main().catch(console.error);
