import { db } from "../db";
import { sql } from "drizzle-orm";

async function main() {
    const res = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'user'
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
}

main().catch(console.error);
