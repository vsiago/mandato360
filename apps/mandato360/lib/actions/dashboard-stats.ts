"use server"

import { db } from "@/lib/db";
import { tenant, lead, lideranca, legislativo, agendaPublica, bairro, assessor, indicacaoPopular, pesquisa, pesquisaResposta, demanda } from "@/lib/db/schema";
import { eq, sql, and, count, gte, desc } from "drizzle-orm";

export async function getDashboardStats(tenantId: string) {
  try {
    const [
      leadsCount,
      liderancasCount,
      indicacoesLegCount,
      projetosTramitandoCount,
      bairrosCount,
      assessoresCount,
      agendaCount,
      pesquisasCount,
    ] = await Promise.all([
      db.select({ count: count() }).from(lead).where(eq(lead.tenantId, tenantId)),
      db.select({ count: count() }).from(lideranca).where(eq(lideranca.tenantId, tenantId)),
      db.select({ count: count() }).from(legislativo).where(and(eq(legislativo.tenantId, tenantId), eq(legislativo.tipo, "indicacao"))),
      db.select({ count: count() }).from(legislativo).where(and(eq(legislativo.tenantId, tenantId), eq(legislativo.status, "tramitando"))),
      db.select({ count: count() }).from(bairro).where(eq(bairro.tenantId, tenantId)),
      db.select({ count: count() }).from(assessor).where(eq(assessor.tenantId, tenantId)),
      db.select({ count: count() }).from(agendaPublica).where(eq(agendaPublica.tenantId, tenantId)),
      db.select({ count: count() }).from(pesquisa).where(eq(pesquisa.tenantId, tenantId)),
    ]);

    return {
      leads: leadsCount[0].count,
      liderancas: liderancasCount[0].count,
      indicacoesLeg: indicacoesLegCount[0].count,
      projetosTramitando: projetosTramitandoCount[0].count,
      bairros: bairrosCount[0].count,
      assessores: assessoresCount[0].count,
      agendas: agendaCount[0].count,
      pesquisas: pesquisasCount[0].count,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { leads: 0, liderancas: 0, indicacoesLeg: 0, projetosTramitando: 0, bairros: 0, assessores: 0, agendas: 0, pesquisas: 0 };
  }
}

export async function getLeadsByFunil(tenantId: string) {
  try {
    const result = await db
      .select({ funil: lead.funil, count: count() })
      .from(lead)
      .where(eq(lead.tenantId, tenantId))
      .groupBy(lead.funil);
    return result;
  } catch { return []; }
}

export async function getProjetosStatusChart(tenantId: string) {
  try {
    const result = await db
      .select({ status: legislativo.status, count: count() })
      .from(legislativo)
      .where(eq(legislativo.tenantId, tenantId))
      .groupBy(legislativo.status);
    return result;
  } catch { return []; }
}

export async function getUpcomingAgenda(tenantId: string, limit = 5) {
  try {
    const now = new Date();
    const result = await db.query.agendaPublica.findMany({
      where: and(eq(agendaPublica.tenantId, tenantId), gte(agendaPublica.dataEvento, now)),
      orderBy: agendaPublica.dataEvento,
      limit,
    });
    return result;
  } catch { return []; }
}

export async function getRecentLeads(tenantId: string, limit = 5) {
  try {
    const result = await db.query.lead.findMany({
      where: eq(lead.tenantId, tenantId),
      orderBy: desc(lead.createdAt),
      limit,
    });
    return result;
  } catch { return []; }
}
