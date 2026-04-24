import { db } from "../db";
import { user as userTable } from "../db/schema";

async function main() {
    const users = await db.select().from(userTable).limit(5);
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
