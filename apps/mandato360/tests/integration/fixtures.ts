import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { hashPassword } from "better-auth/crypto";
import { eq, inArray } from "drizzle-orm";

const MARCA = "__e2e__";

export interface TenantsDeTeste {
  a: { id: string; slug: string };
  b: { id: string; slug: string };
  /** Usuario COMUM, vinculado apenas ao tenant A. Nao e admin da plataforma. */
  membro: { id: string; email: string; senha: string };
}

/**
 * Cria dois tenants isolados (A = "meu", B = "do outro") e um usuario comum
 * vinculado SO ao tenant A.
 *
 * O usuario precisa ser comum de proposito: `admin@mandato360.com` tem role
 * global "admin", que atravessa qualquer tenant por design (telas /master).
 * Testar isolamento com ele nao provaria nada.
 */
export async function criarTenantsDeTeste(): Promise<TenantsDeTeste> {
  const stamp = Date.now();
  const [a] = await db
    .insert(schema.tenant)
    .values({ slug: `${MARCA}-a-${stamp}`, name: `${MARCA} Tenant A` })
    .returning();
  const [b] = await db
    .insert(schema.tenant)
    .values({ slug: `${MARCA}-b-${stamp}`, name: `${MARCA} Tenant B` })
    .returning();

  const email = `${MARCA}-membro-${stamp}@teste.local`;
  const senha = "SenhaE2E@123456";
  const userId = `${MARCA}-user-${stamp}`;
  const agora = new Date();

  await db.insert(schema.user).values({
    id: userId,
    name: "Membro E2E",
    email,
    emailVerified: true,
    image: null,
    createdAt: agora,
    updatedAt: agora,
    role: "user", // NAO e admin de plataforma
  });

  await db.insert(schema.account).values({
    id: `${MARCA}-account-${stamp}`,
    accountId: userId,
    providerId: "credential",
    userId,
    password: await hashPassword(senha),
    createdAt: agora,
    updatedAt: agora,
  });

  // Vinculo apenas com o tenant A, como dono do mandato.
  await db.insert(schema.tenantMember).values({
    tenantId: a.id,
    userId,
    role: "owner",
  });

  return {
    a: { id: a.id, slug: a.slug },
    b: { id: b.id, slug: b.slug },
    membro: { id: userId, email, senha },
  };
}

/** Remove tudo que o teste criou, respeitando as FKs. */
export async function limparTenantsDeTeste(ids: string[], userId?: string) {
  if (!ids.length) return;

  const pesquisas = await db.query.pesquisa.findMany({
    where: inArray(schema.pesquisa.tenantId, ids as any),
    columns: { id: true },
  });
  if (pesquisas.length) {
    await db.delete(schema.pesquisaResposta).where(
      inArray(schema.pesquisaResposta.pesquisaId, pesquisas.map((p) => p.id) as any)
    );
  }

  await db.delete(schema.indicacaoPopular).where(inArray(schema.indicacaoPopular.tenantId, ids as any));
  await db.delete(schema.pesquisa).where(inArray(schema.pesquisa.tenantId, ids as any));
  await db.delete(schema.demanda).where(inArray(schema.demanda.tenantId, ids as any));
  await db.delete(schema.lead).where(inArray(schema.lead.tenantId, ids as any));
  await db.delete(schema.lideranca).where(inArray(schema.lideranca.tenantId, ids as any));
  await db.delete(schema.bairro).where(inArray(schema.bairro.tenantId, ids as any));
  await db.delete(schema.assessor).where(inArray(schema.assessor.tenantId, ids as any));
  await db.delete(schema.agendaPublica).where(inArray(schema.agendaPublica.tenantId, ids as any));
  await db.delete(schema.legislativo).where(inArray(schema.legislativo.tenantId, ids as any));
  await db.delete(schema.publicacao).where(inArray(schema.publicacao.tenantId, ids as any));
  await db.delete(schema.tenantMember).where(inArray(schema.tenantMember.tenantId, ids as any));

  for (const id of ids) {
    await db.delete(schema.tenant).where(eq(schema.tenant.id, id));
  }

  if (userId) {
    await db.delete(schema.session).where(eq(schema.session.userId, userId));
    await db.delete(schema.account).where(eq(schema.account.userId, userId));
    await db.delete(schema.user).where(eq(schema.user.id, userId));
  }
}

/** Desfaz a conexao do postgres para o vitest conseguir encerrar. */
export async function fecharConexao() {
  const { client } = await import("@/lib/db");
  await client.end({ timeout: 5 });
}
