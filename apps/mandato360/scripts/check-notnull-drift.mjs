import postgres from "postgres";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = postgres(url, { prepare: false, connect_timeout: 20 });

const src = readFileSync(new URL("../lib/db/schema.ts", import.meta.url), "utf8");

// Colunas que o schema.ts declara como obrigatorias (.notNull())
const obrigatoriasNoCodigo = new Map();
const re = /pgTable\("([a-z_]+)",\s*\{([\s\S]*?)\n\}\)/g;
let m;
while ((m = re.exec(src))) {
  const set = new Set();
  for (const line of m[2].split("\n")) {
    if (line.trim().startsWith("//")) continue;
    const cm = line.match(/^\s*\w+:\s*\w+\(\s*"([^"]+)"/);
    if (cm && (line.includes(".notNull()") || line.includes(".primaryKey()"))) set.add(cm[1]);
  }
  obrigatoriasNoCodigo.set(m[1], set);
}

const cols = await sql`
  SELECT table_name, column_name, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema='public' ORDER BY table_name, ordinal_position`;

console.log("=== BANCO exige NOT NULL, mas o codigo trata como opcional ===");
console.log("(insert sem esse campo -> quebra em producao)\n");
let achou = 0;
for (const c of cols) {
  const doCodigo = obrigatoriasNoCodigo.get(c.table_name);
  if (!doCodigo) continue;
  if (c.is_nullable === "NO" && !c.column_default && !doCodigo.has(c.column_name)) {
    console.log(`  ${c.table_name}.${c.column_name}`);
    achou++;
  }
}
if (!achou) console.log("  (nenhuma)");

console.log("\n=== Colunas que existem no BANCO mas nao no schema.ts ===");
const porTabela = new Map();
for (const c of cols) {
  if (!porTabela.has(c.table_name)) porTabela.set(c.table_name, []);
  porTabela.get(c.table_name).push(c);
}
const todasDoCodigo = new Map();
const re2 = /pgTable\("([a-z_]+)",\s*\{([\s\S]*?)\n\}\)/g;
while ((m = re2.exec(src))) {
  const set = new Set();
  for (const line of m[2].split("\n")) {
    if (line.trim().startsWith("//")) continue;
    const cm = line.match(/^\s*\w+:\s*\w+\(\s*"([^"]+)"/);
    if (cm) set.add(cm[1]);
  }
  todasDoCodigo.set(m[1], set);
}
for (const [t, lista] of porTabela) {
  const doCodigo = todasDoCodigo.get(t);
  if (!doCodigo) continue;
  const extras = lista.filter((c) => !doCodigo.has(c.column_name));
  if (extras.length) {
    console.log(
      `  ${t}: ${extras.map((e) => `${e.column_name}${e.is_nullable === "NO" && !e.column_default ? " [NOT NULL sem default!]" : ""}`).join(", ")}`
    );
  }
}

await sql.end();
