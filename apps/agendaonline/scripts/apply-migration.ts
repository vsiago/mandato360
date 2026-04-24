import "dotenv/config"
import { db } from "../db"
import { sql } from "drizzle-orm"

async function applyMigration() {
  console.log("🔄 Applying migration: config_version, last_published, published_by, tenant_drafts, tenant_config_history...")

  try {
    // Add columns to tenants (IF NOT EXISTS for safety)
    await db.execute(sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS config_version INTEGER DEFAULT 1 NOT NULL`)
    console.log("  ✅ config_version added")

    await db.execute(sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS last_published TIMESTAMP`)
    console.log("  ✅ last_published added")

    await db.execute(sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS published_by TEXT REFERENCES "user"(id)`)
    console.log("  ✅ published_by added")

    // Create tenant_drafts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tenant_drafts (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        config_snapshot JSONB NOT NULL,
        created_by TEXT REFERENCES "user"(id),
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `)
    console.log("  ✅ tenant_drafts table created")

    // Create tenant_config_history table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tenant_config_history (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL REFERENCES tenants(id),
        version INTEGER NOT NULL,
        config_snapshot JSONB NOT NULL,
        change_summary TEXT,
        changed_by TEXT REFERENCES "user"(id),
        changed_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `)
    console.log("  ✅ tenant_config_history table created")

    console.log("\n🎉 Migration applied successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
  }
  process.exit(0)
}

applyMigration()
