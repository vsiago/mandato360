import { db } from "../db"
import { businessTypes } from "../db/schema"

async function main() {
    try {
        const types = await db.select().from(businessTypes)
        console.log(JSON.stringify(types, null, 2))
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main()
