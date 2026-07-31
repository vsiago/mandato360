import postgres from "postgres";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = postgres(url, { prepare: false, connect_timeout: 20 });

const cols = await sql`
  SELECT table_name, column_name FROM information_schema.columns
  WHERE table_schema='public' ORDER BY table_name, ordinal_position`;

const dbTables = new Map();
for (const c of cols) {
  if (!dbTables.has(c.table_name)) dbTables.set(c.table_name, new Set());
  dbTables.get(c.table_name).add(c.column_name);
}

// Parse schema.ts: pgTable("name", { ... })
const src = readFileSync(new URL("../lib/db/schema.ts", import.meta.url), "utf8");
const re = /pgTable\("([a-z_]+)",\s*\{([\s\S]*?)\n\}\)/g;
let m;
const report = [];
while ((m = re.exec(src))) {
  const table = m[1];
  const body = m[2];
  const wanted = [];
  // match: fieldName: type("col_name")  — ignore commented lines
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("//")) continue;
    const cm = line.match(/^\s*(\w+):\s*\w+\(\s*"([^"]+)"/);
    if (cm) wanted.push(cm[2]);
  }
  if (!dbTables.has(table)) {
    report.push({ table, status: "TABELA AUSENTE", missing: wanted });
  } else {
    const have = dbTables.get(table);
    const missing = wanted.filter((c) => !have.has(c));
    report.push({ table, status: missing.length ? "COLUNAS AUSENTES" : "OK", missing });
  }
}

console.log("=== DRIFT schema.ts x BANCO ===\n");
for (const r of report) {
  const icon = r.status === "OK" ? "OK  " : "FALTA";
  console.log(`[${icon}] ${r.table.padEnd(20)} ${r.status}${r.missing.length ? " -> " + r.missing.join(", ") : ""}`);
}

const enums = await sql`
  SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
  WHERE n.nspname='public' AND t.typtype='e'`;
const dbEnums = new Set(enums.map((e) => e.typname));
const wantedEnums = [...src.matchAll(/pgEnum\("([a-z_]+)"/g)].map((x) => x[1]);
console.log("\n=== ENUMS ===");
for (const e of wantedEnums) console.log(`[${dbEnums.has(e) ? "OK   " : "FALTA"}] ${e}`);

await sql.end();
