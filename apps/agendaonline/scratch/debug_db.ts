
import { db } from "../db";
import { appointments } from "../db/schema";

async function main() {
    try {
        const allApts = await db.select().from(appointments);
        console.log("TOTAL_APPOINTMENTS_COUNT:", allApts.length);
        const today = "2026-04-26";
        const todayApts = allApts.filter(a => a.date === today);
        console.log(`APPOINTMENTS_FOR_${today}:`, JSON.stringify(todayApts, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main().catch(console.error);
