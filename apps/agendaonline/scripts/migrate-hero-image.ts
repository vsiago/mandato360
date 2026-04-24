import postgres from "postgres"
import "dotenv/config"

const DATABASE_URL = process.env.DATABASE_URL!
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1) }

const sql = postgres(DATABASE_URL)

async function main() {
    console.log("🔄 Applying hero_image_settings migration...\n")

    const query = `ALTER TABLE "tenants" ADD COLUMN "hero_image_settings" jsonb;`

    try {
        console.log(`  ▸ ${query}`)
        await sql.unsafe(query)
        console.log(`    ✅ OK`)
    } catch (error: any) {
        if (error.code === "42701") { // column already exists
            console.log(`    ⏩ Column already exists, skipping`)
        } else {
            console.error(`    ❌ Error: ${error.message}`)
            throw error
        }
    }

    console.log("\n✨ Migration complete!")
    await sql.end()
    process.exit(0)
}

main().catch(err => {
    console.error("❌ Migration failed:", err)
    process.exit(1)
})
