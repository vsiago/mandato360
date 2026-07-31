import postgres from "postgres";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = postgres(url, { prepare: false, connect_timeout: 20 });

const slug = process.argv[2] || "fabinho-da-prime";
const [t] = await sql`SELECT config FROM tenant WHERE slug = ${slug}`;
if (!t?.config) {
  console.log("sem config");
} else {
  const parsed = JSON.parse(t.config);
  console.log("hero.overlay:", JSON.stringify(parsed.__editorConfig?.hero?.overlay, null, 2));
  console.log("hero keys:", Object.keys(parsed.__editorConfig?.hero || {}));
  console.log("top-level __editorConfig keys:", Object.keys(parsed.__editorConfig || {}));
}
await sql.end();
