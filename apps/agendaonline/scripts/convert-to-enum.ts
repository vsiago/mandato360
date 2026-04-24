import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Converting role column to enum...");
    try {
        await db.execute(sql`DO $$ BEGIN
            CREATE TYPE "role" AS ENUM ('user', 'admin', 'superadmin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

        await db.execute(sql`ALTER TABLE "user" ALTER COLUMN "role" TYPE "role" USING "role"::"role"`);
        console.log("Conversion successful.");
    } catch (e: any) {
        console.error("Error converting column:", e);
    }
    process.exit(0);
}

main().catch(console.error);
