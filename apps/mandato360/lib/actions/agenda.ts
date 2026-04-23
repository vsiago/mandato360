"use server"

import { db } from "@/lib/db";
import { agendaPublica } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";

export async function getAgendas(tenantId: string) {
  try {
    return await db.query.agendaPublica.findMany({
      where: eq(agendaPublica.tenantId, tenantId),
      orderBy: desc(agendaPublica.dataEvento),
    });
  } catch (error) {
    console.error("Erro ao buscar todas as agendas:", error);
    return [];
  }
}

export async function getAgendasPublicas(tenantId: string) {
  try {
    const now = new Date();
    return await db.query.agendaPublica.findMany({
      where: and(eq(agendaPublica.tenantId, tenantId), eq(agendaPublica.visivel, true), gte(agendaPublica.dataEvento, now)),
      orderBy: agendaPublica.dataEvento,
    });
  } catch (error) {
    console.error("Erro ao buscar agendas:", error);
    return [];
  }
}

export async function createAgenda(data: {
  tenantId: string;
  titulo: string;
  descricao?: string;
  local?: string;
  dataEvento: Date;
  tipo?: "visita" | "acao" | "audiencia" | "reuniao" | "evento" | "outro";
  visivel?: boolean;
}) {
  try {
    const [result] = await db.insert(agendaPublica).values(data).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar evento." };
  }
}

export async function updateAgenda(id: string, data: Partial<{
  titulo: string;
  descricao: string;
  local: string;
  dataEvento: Date;
  tipo: "visita" | "acao" | "audiencia" | "reuniao" | "evento" | "outro";
  visivel: boolean;
}>) {
  try {
    const [result] = await db.update(agendaPublica).set(data).where(eq(agendaPublica.id, id)).returning();
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao atualizar evento." };
  }
}

export async function deleteAgenda(id: string) {
  try {
    await db.delete(agendaPublica).where(eq(agendaPublica.id, id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao excluir evento." };
  }
}
