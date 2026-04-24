import postgres from "postgres"
import fs from "fs"
import "dotenv/config"

async function main() {
    const DATABASE_URL = process.env.DATABASE_URL
    if (!DATABASE_URL) throw new Error("Missing DATABASE_URL")
    
    const sql = postgres(DATABASE_URL)
    const script = fs.readFileSync("scripts/migration-taxonomy-fields.sql", "utf-8")
    
    console.log("Executing SQL migration...")
    await sql.unsafe(script)
    console.log("Migration executed successfully.")
    
    await sql.end()
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
