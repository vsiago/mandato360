/**
 * Manual Migration: Apply taxonomy tables + niche → business_type_id migration
 * Run: npx tsx scripts/migrate-taxonomy.ts
 */
import postgres from "postgres"
import * as fs from "fs"
import * as path from "path"
import "dotenv/config"

const DATABASE_URL = process.env.DATABASE_URL!
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1) }

const sql = postgres(DATABASE_URL)

async function main() {
    console.log("🔄 Applying taxonomy migration...\n")

    const migrationPath = path.join(__dirname, "../drizzle/0001_romantic_jetstream.sql")
    const migrationSql = fs.readFileSync(migrationPath, "utf-8")

    // Split by statement-breakpoint
    const statements = migrationSql
        .split("-->")
        .map(s => s.replace(/^\s*statement-breakpoint\s*/m, "").trim())
        .filter(s => s.length > 0 && !s.startsWith("--"))

    for (const stmt of statements) {
        // Skip comment-only statements
        const cleanStmt = stmt.split("\n").filter(l => !l.trim().startsWith("--")).join("\n").trim()
        if (!cleanStmt) continue

        try {
            console.log(`  ▸ ${cleanStmt.substring(0, 80).replace(/\n/g, " ")}...`)
            await sql.unsafe(cleanStmt)
            console.log(`    ✅ OK`)
        } catch (error: any) {
            if (error.code === "42P07") { // table already exists
                console.log(`    ⏩ Table already exists, skipping`)
            } else if (error.code === "42701") { // column already exists
                console.log(`    ⏩ Column already exists, skipping`)
            } else if (error.code === "42710") { // constraint already exists
                console.log(`    ⏩ Constraint already exists, skipping`)
            } else {
                console.error(`    ❌ Error: ${error.message}`)
                throw error
            }
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
