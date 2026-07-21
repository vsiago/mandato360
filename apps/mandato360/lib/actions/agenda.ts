"use server"

import { db } from "@/lib/db";
import { agendaPublica } from "@/lib/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { validateTenantAccess } from "@/lib/auth-utils";
import { agendaSchemas } from "@/lib/validations";
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function getAgendas(tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    return await db.query.agendaPublica.findMany({
      where: eq(agendaPublica.tenantId, tenantId),
      orderBy: desc(agendaPublica.dataEvento),
    });
  } catch (error) {
    console.error("Erro ao buscar todas as agendas:", error);
    throw error;
  }
}

export async function getAgendasPublicas(tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    const now = new Date();
    return await db.query.agendaPublica.findMany({
      where: and(eq(agendaPublica.tenantId, tenantId), eq(agendaPublica.visivel, true), gte(agendaPublica.dataEvento, now)),
      orderBy: agendaPublica.dataEvento,
    });
  } catch (error) {
    console.error("Erro ao buscar agendas:", error);
    throw error;
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
    // ✅ SECURITY: Validate tenant access (requires assessor role)
    await validateTenantAccess(data.tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Validate input with Zod
    const validated = agendaSchemas.create.parse(data);

    const [result] = await db.insert(agendaPublica).values(validated).returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[createAgenda Error]", error);
    return { success: false, error: error.message || "Erro ao criar evento." };
  }
}

export async function updateAgenda(
  id: string,
  tenantId: string,
  data: Partial<{
    titulo: string;
    descricao: string;
    local: string;
    dataEvento: Date;
    tipo: "visita" | "acao" | "audiencia" | "reuniao" | "evento" | "outro";
    visivel: boolean;
  }>
) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify agenda belongs to tenant
    const existingAgenda = await db.query.agendaPublica.findFirst({
      where: and(eq(agendaPublica.id, id), eq(agendaPublica.tenantId, tenantId)),
    });

    if (!existingAgenda) {
      throw new Error("Agenda not found or access denied");
    }

    const [result] = await db
      .update(agendaPublica)
      .set(data)
      .where(and(eq(agendaPublica.id, id), eq(agendaPublica.tenantId, tenantId)))
      .returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[updateAgenda Error]", error);
    return { success: false, error: error.message || "Erro ao atualizar evento." };
  }
}

export async function deleteAgenda(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access (requires admin role)
    await validateTenantAccess(tenantId, "admin");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify agenda belongs to tenant
    const existingAgenda = await db.query.agendaPublica.findFirst({
      where: and(eq(agendaPublica.id, id), eq(agendaPublica.tenantId, tenantId)),
    });

    if (!existingAgenda) {
      throw new Error("Agenda not found or access denied");
    }

    await db
      .delete(agendaPublica)
      .where(and(eq(agendaPublica.id, id), eq(agendaPublica.tenantId, tenantId)));
    return { success: true };
  } catch (error: any) {
    console.error("[deleteAgenda Error]", error);
    return { success: false, error: error.message || "Erro ao excluir evento." };
  }
}
