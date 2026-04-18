"use server"

// Legacy compatibility layer - redirects to leads actions
// This file maintains backward compatibility for old pages that still reference "eleitores"

import { getLeads, getLeadById, createLead, updateLead, deleteLead } from "./leads"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export async function getEleitoresByTenant(tenantSlug: string) {
  try {
    const tenantResult = await db.query.tenant.findFirst({
      where: eq(schema.tenant.slug, tenantSlug),
    });

    if (!tenantResult) return [];

    const result = await db.query.lead.findMany({
      where: eq(schema.lead.tenantId, tenantResult.id),
      orderBy: [desc(schema.lead.createdAt)],
      with: {
        demandas: true,
      }
    });

    return result.map(e => ({
      id: e.id,
      nome: e.nome,
      email: e.email || "",
      telefone: e.telefone || "",
      bairro: e.bairroNome || "",
      dataCadastro: e.createdAt.toISOString(),
      totalSolicitacoes: e.demandas.length,
      statusRelacionamento: e.funil === "apoiador" ? "apoiador" : e.funil === "engajado" ? "simpatizante" : e.funil === "inativo" ? "problema" : "neutro",
      observacoes: e.observacoes || "",
      demandas: e.demandas.map(d => ({
        id: d.id,
        tipo: d.tipo,
        descricao: d.descricao,
        data: d.data.toISOString(),
        status: d.status,
      })),
    }));
  } catch (error) {
    console.error("Error fetching eleitores:", error);
    return [];
  }
}

export async function getEleitorWithDemandas(eleitorId: string) {
  return await getLeadById(eleitorId);
}

export async function updateEleitor(id: string, data: any) {
  return await updateLead(id, data);
}

export async function createEleitor(tenantSlug: string, data: any) {
  const tenantResult = await db.query.tenant.findFirst({
    where: eq(schema.tenant.slug, tenantSlug),
  });
  if (!tenantResult) return { success: false, error: "Tenant not found" };
  return await createLead({ ...data, tenantId: tenantResult.id });
}
