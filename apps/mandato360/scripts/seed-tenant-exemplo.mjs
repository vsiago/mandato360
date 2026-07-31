/**
 * Cria um tenant de exemplo (um mandato) e vincula o usuario admin a ele.
 *
 * Uso:  node scripts/seed-tenant-exemplo.mjs [slug] [nome]
 * Ex.:  node scripts/seed-tenant-exemplo.mjs joao-silva "Joao Silva"
 *
 * Idempotente: se o slug ja existir, apenas garante o vinculo do admin.
 */
import postgres from "postgres";
import { readFileSync } from "fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = postgres(url, { prepare: false, connect_timeout: 30, max: 1 });

const slug = process.argv[2] || "vereador-exemplo";
const nome = process.argv[3] || "Vereador Exemplo";
const EMAIL_ADMIN = "admin@mandato360.com";

const [existente] = await sql`SELECT id, slug FROM tenant WHERE slug = ${slug}`;

let tenantId;
if (existente) {
  tenantId = existente.id;
  console.log(`Tenant "${slug}" ja existia (${tenantId}).`);
} else {
  const [novo] = await sql`
    INSERT INTO tenant (slug, name, cidade, partido, cargo, biografia, tagline,
                        hero_headline, hero_highlight, hero_description, hero_cta_text,
                        primary_color, secondary_color)
    VALUES (${slug}, ${nome}, 'Rio de Janeiro', 'PSD', 'Vereador',
            ${`${nome} atua com foco em saude, educacao e infraestrutura de bairro.`},
            'Mandato Participativo',
            'Por uma cidade de', 'Resultados',
            'Acompanhe o mandato, envie sua demanda e participe das decisoes.',
            'Solicitar Demanda',
            '#0F2B5B', '#0D9F6E')
    RETURNING id, slug`;
  tenantId = novo.id;
  console.log(`Tenant criado: ${slug} (${tenantId})`);
}

const [admin] = await sql`SELECT id FROM "user" WHERE email = ${EMAIL_ADMIN}`;
if (!admin) {
  console.log(`AVISO: usuario ${EMAIL_ADMIN} nao encontrado; vinculo nao criado.`);
} else {
  const [vinculo] = await sql`
    SELECT id FROM tenant_member WHERE "tenantId" = ${tenantId} AND "userId" = ${admin.id}`;
  if (vinculo) {
    console.log("Vinculo do admin ja existia.");
  } else {
    await sql`
      INSERT INTO tenant_member ("tenantId", "userId", role)
      VALUES (${tenantId}, ${admin.id}, 'owner')`;
    console.log("Vinculo do admin criado (role: owner).");
  }
}

console.log("");
console.log("Acesse:");
console.log(`  Painel : /${slug}/dashboard`);
console.log(`  Site   : /${slug}`);

await sql.end();
