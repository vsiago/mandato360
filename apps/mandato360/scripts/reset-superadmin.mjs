/**
 * Reseta a senha do superadmin e remove contas de demonstracao.
 *
 * Uso: node scripts/reset-superadmin.mjs
 *
 * - Gera senha forte, grava com o hash do proprio better-auth
 * - Invalida TODAS as sessoes ativas do superadmin (forca novo login)
 * - Apaga as contas de demo passadas em REMOVER (recusa se alguma for dona
 *   de um mandato, para nao deixar mandato orfao)
 */
import postgres from "postgres";
import { hashPassword } from "better-auth/crypto";
import { randomBytes } from "crypto";
import { readFileSync } from "fs";

const EMAIL_SUPERADMIN = "admin@mandato360.com";
const REMOVER = ["demo@mandato360.com", "fabinhoprime@mandato.com"];

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const url = env.match(/DATABASE_URL="([^"]+)"/)[1];
const sql = postgres(url, { prepare: false, connect_timeout: 30, max: 1 });

/** Senha forte e ainda digitavel: 4 blocos + simbolo. */
function gerarSenha() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = randomBytes(20);
  let s = "";
  for (let i = 0; i < 20; i++) {
    if (i > 0 && i % 5 === 0) s += "-";
    s += alfabeto[bytes[i] % alfabeto.length];
  }
  return s + "!7";
}

const senhaNova = gerarSenha();

// ─── 1. Reset do superadmin ───
const [admin] = await sql`SELECT id, role FROM "user" WHERE email = ${EMAIL_SUPERADMIN}`;
if (!admin) {
  console.error(`ERRO: ${EMAIL_SUPERADMIN} nao encontrado.`);
  await sql.end();
  process.exit(1);
}

const hash = await hashPassword(senhaNova);
const atualizadas = await sql`
  UPDATE account SET password = ${hash}, "updatedAt" = now()
  WHERE "userId" = ${admin.id} AND "providerId" = 'credential'
  RETURNING id`;

if (atualizadas.length === 0) {
  await sql`
    INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
    VALUES (${"account-" + admin.id}, ${admin.id}, 'credential', ${admin.id}, ${hash}, now(), now())`;
  console.log("Login por senha criado para o superadmin.");
} else {
  console.log("Senha do superadmin atualizada.");
}

// Garante o papel de admin da plataforma.
if (admin.role !== "admin") {
  await sql`UPDATE "user" SET role = 'admin' WHERE id = ${admin.id}`;
  console.log(`Papel corrigido: ${admin.role} -> admin`);
}

// Derruba sessoes antigas: quem estivesse logado com a senha velha sai.
const derrubadas = await sql`DELETE FROM session WHERE "userId" = ${admin.id} RETURNING id`;
console.log(`Sessoes invalidadas: ${derrubadas.length}`);

// ─── 2. Remocao das contas de demonstracao ───
console.log("");
for (const email of REMOVER) {
  const [u] = await sql`SELECT id FROM "user" WHERE email = ${email}`;
  if (!u) {
    console.log(`  ${email}: ja nao existia`);
    continue;
  }

  const [{ count }] = await sql`
    SELECT count(*)::int AS count FROM tenant_member WHERE "userId" = ${u.id}`;
  if (count > 0) {
    console.log(`  ${email}: MANTIDO — e dono de ${count} mandato(s), remover deixaria orfao`);
    continue;
  }

  await sql`DELETE FROM session WHERE "userId" = ${u.id}`;
  await sql`DELETE FROM account WHERE "userId" = ${u.id}`;
  await sql`DELETE FROM "user" WHERE id = ${u.id}`;
  console.log(`  ${email}: removido`);
}

console.log("");
console.log("=".repeat(52));
console.log("  SUPERADMIN");
console.log(`  E-mail : ${EMAIL_SUPERADMIN}`);
console.log(`  Senha  : ${senhaNova}`);
console.log("=".repeat(52));
console.log("  Guarde agora — a senha nao fica salva em lugar nenhum.");

await sql.end();
