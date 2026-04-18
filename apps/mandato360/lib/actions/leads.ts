"use server"

import { db } from "@/lib/db";
import { lead } from "@/lib/db/schema";
import { eq, desc, and, ilike, count } from "drizzle-orm";

export async function getLeads(tenantId: string, options?: { limit?: number; offset?: number; search?: string; funil?: string }) {
  try {
    const conditions = [eq(lead.tenantId, tenantId)];
    if (options?.funil) {
      conditions.push(eq(lead.funil, options.funil as any));
    }

    const result = await db.query.lead.findMany({
      where: and(...conditions),
      orderBy: desc(lead.createdAt),
      limit: options?.limit || 50,
      offset: options?.offset || 0,
      with: {
        bairroRef: true,
        liderancaRef: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function getLeadById(id: string) {
  return await db.query.lead.findFirst({ where: eq(lead.id, id), with: { bairroRef: true, liderancaRef: true } });
}

export async function createLead(data: {
  tenantId: string;
  nome: string;
  email?: string;
  telefone?: string;
  bairroId?: string;
  bairroNome?: string;
  liderancaId?: string;
  funil?: "novo" | "contato" | "engajado" | "apoiador" | "lideranca" | "inativo";
  origem?: string;
  observacoes?: string;
  cpf?: string;
  dataNascimento?: string;
}) {
  try {
    const [result] = await db.insert(lead).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar lead." };
  }
}

export async function updateLead(id: string, data: Partial<{
  nome: string;
  email: string;
  telefone: string;
  bairroId: string;
  bairroNome: string;
  liderancaId: string;
  funil: "novo" | "contato" | "engajado" | "apoiador" | "lideranca" | "inativo";
  observacoes: string;
  cpf: string;
  dataNascimento: string;
}>) {
  try {
    const [result] = await db.update(lead).set({ ...data, updatedAt: new Date() }).where(eq(lead.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar lead." };
  }
}

export async function deleteLead(id: string) {
  try {
    await db.delete(lead).where(eq(lead.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir lead." };
  }
}

export async function getLeadsCountByFunil(tenantId: string) {
  try {
    const result = await db
      .select({ funil: lead.funil, count: count() })
      .from(lead)
      .where(eq(lead.tenantId, tenantId))
      .groupBy(lead.funil);
    return result;
  } catch { return []; }
}
