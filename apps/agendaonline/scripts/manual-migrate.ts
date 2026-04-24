import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Adding role column manually...");
    try {
        await db.execute(sql`ALTER TABLE "user" ADD COLUMN "role" text NOT NULL DEFAULT 'user'`);
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
