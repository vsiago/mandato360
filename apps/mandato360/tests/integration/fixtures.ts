import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

const MARCA = "__e2e__";

export interface TenantsDeTeste {
  a: { id: string; slug: string };
  b: { id: string; slug: string };
}

/** Cria dois tenants isolados para o teste (A = "meu", B = "do outro"). */
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
  return { a: { id: a.id, slug: a.slug }, b: { id: b.id, slug: b.slug } };
}

/** Remove tudo que o teste criou, respeitando as FKs. */
export async function limparTenantsDeTeste(ids: string[]) {
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
}

/** Desfaz a conexao do postgres para o vitest conseguir encerrar. */
export async function fecharConexao() {
  const { client } = await import("@/lib/db");
  await client.end({ timeout: 5 });
}
