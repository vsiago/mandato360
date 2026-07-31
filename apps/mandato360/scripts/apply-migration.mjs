import postgres from "postgres";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const file = process.argv[2];
if (!file) throw new Error("uso: node scripts/_apply-migration.mjs <arquivo.sql>");

const sqlText = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const sql = postgres(url, { prepare: false, connect_timeout: 30, max: 1 });

console.log(`Aplicando ${file} ...`);
try {
  await sql.unsafe(sqlText);
  console.log("OK - migracao aplicada sem erros");
} catch (e) {
  console.error("ERRO:", e.message);
  process.exitCode = 1;
}
await sql.end();
