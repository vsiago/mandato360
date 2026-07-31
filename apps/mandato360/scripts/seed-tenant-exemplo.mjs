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

// NAO vincular o superadmin como membro deste mandato: ele ja atravessa
// qualquer tenant pelo papel global, e o vinculo faria a raiz "/" jogar o
// dono da plataforma no dashboard de um vereador em vez de /master.
console.log("");
console.log("Acesse:");
console.log(`  Painel do mandato   : /${slug}/dashboard`);
console.log(`  Site publico        : /${slug}`);
console.log(`  Painel da plataforma: /master/tenants  (${EMAIL_ADMIN})`);

await sql.end();
