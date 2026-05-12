import { db } from "../db";
import { user } from "../db/schema";

async function main() {
    const users = await db.select().from(user);
    users.forEach(u => console.log(`User: ${u.email} | Name: ${u.name} | ID: ${u.id}`));
}

main().catch(console.error);
