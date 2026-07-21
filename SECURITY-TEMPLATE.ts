/**
 * TEMPLATE SEGURO PARA SERVER ACTIONS
 *
 * Copie e adapte este template para lib/actions/*.ts
 * Substitua LEAD por seu modelo (DEMANDA, AGENDA, etc)
 */

"use server"

import { db } from "@/lib/db";
import { lead } from "@/lib/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { validateTenantAccess } from "@/lib/auth-utils";
import { leadSchemas } from "@/lib/validations"; // ADAPTE SCHEMA
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📖 READ - List (GET)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getLeads(
  tenantId: string,
  options?: { limit?: number; offset?: number; search?: string; funil?: string }
) {
  try {
    // ✅ 1. AUTORIZAÇÃO - Validar tenant access (role: readonly)
    const auth = await validateTenantAccess(tenantId, "readonly");

    // ✅ 2. RATE LIMITING - Prevenir abuso
    await checkRateLimit(rateLimitPresets.api);

    // ✅ 3. VALIDAÇÃO - Zod schema
    const validated = leadSchemas.list.parse({
      tenantId,
      limit: options?.limit,
      offset: options?.offset,
      search: options?.search,
      funil: options?.funil,
    });

    // ✅ 4. QUERY - Sempre incluir tenantId na condição
    const conditions = [eq(lead.tenantId, validated.tenantId)];

    if (validated.search) {
      conditions.push(
        // Seu field de busca aqui
      );
    }

    if (validated.funil) {
      conditions.push(eq(lead.funil, validated.funil as any));
    }

    const result = await db.query.lead.findMany({
      where: and(...conditions),
      orderBy: desc(lead.createdAt),
      limit: validated.limit,
      offset: validated.offset,
    });

    return result;
  } catch (error) {
    console.error("[getLeads Error]", error);
    throw error; // ✅ Propague erro
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📖 READ - Get by ID (GET/:id)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getLeadById(id: string, tenantId: string) {
  try {
    // ✅ 1. AUTORIZAÇÃO
    await validateTenantAccess(tenantId, "readonly");

    // ✅ 2. RATE LIMITING
    await checkRateLimit(rateLimitPresets.api);

    // ✅ 3. QUERY - CRÍTICO: validar tenantId
    const result = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
    });

    if (!result) {
      throw new Error("Lead not found or access denied");
    }

    return result;
  } catch (error) {
    console.error("[getLeadById Error]", error);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✍️ CREATE - Novo registro (POST)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function createLead(data: {
  tenantId: string;
  nome: string;
  email?: string;
  telefone?: string;
  // ... outros campos
}) {
  try {
    // ✅ 1. AUTORIZAÇÃO - Requer role "assessor"
    await validateTenantAccess(data.tenantId, "assessor");

    // ✅ 2. RATE LIMITING
    await checkRateLimit(rateLimitPresets.form);

    // ✅ 3. VALIDAÇÃO - Zod schema
    const validated = leadSchemas.create.parse(data);

    // ✅ 4. INSERT
    const [result] = await db.insert(lead).values(validated).returning();

    return { success: true, data: result };
  } catch (error: any) {
    console.error("[createLead Error]", error);
    return { success: false, error: error.message || "Erro ao criar." };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ✏️ UPDATE - Editar registro (PATCH/:id)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function updateLead(
  id: string,
  tenantId: string,
  data: Partial<{
    nome: string;
    email: string;
    telefone: string;
    // ... outros campos
  }>
) {
  try {
    // ✅ 1. AUTORIZAÇÃO - Requer role "assessor"
    await validateTenantAccess(tenantId, "assessor");

    // ✅ 2. RATE LIMITING
    await checkRateLimit(rateLimitPresets.form);

    // ✅ 3. VALIDAÇÃO - Zod schema
    const validated = leadSchemas.update.parse({ id, tenantId, ...data });

    // ✅ 4. VERIFICAR OWNERSHIP - Lead pertence a este tenant
    const existingLead = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
    });

    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    // ✅ 5. UPDATE - Sempre incluir tenantId na condição
    const [result] = await db
      .update(lead)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(lead.id, id), eq(lead.tenantId, tenantId)))
      .returning();

    return { success: true, data: result };
  } catch (error: any) {
    console.error("[updateLead Error]", error);
    return { success: false, error: error.message || "Erro ao atualizar." };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🗑️ DELETE - Deletar registro (DELETE/:id)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function deleteLead(id: string, tenantId: string) {
  try {
    // ✅ 1. AUTORIZAÇÃO - Requer role "admin"
    await validateTenantAccess(tenantId, "admin");

    // ✅ 2. RATE LIMITING
    await checkRateLimit(rateLimitPresets.form);

    // ✅ 3. VERIFICAR OWNERSHIP
    const existingLead = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
    });

    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    // ✅ 4. DELETE - Sempre incluir tenantId na condição
    await db
      .delete(lead)
      .where(and(eq(lead.id, id), eq(lead.tenantId, tenantId)));

    return { success: true };
  } catch (error: any) {
    console.error("[deleteLead Error]", error);
    return { success: false, error: error.message || "Erro ao deletar." };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📊 ANALYTICS/COUNT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getLeadsCountByFunil(tenantId: string) {
  try {
    // ✅ 1. AUTORIZAÇÃO
    await validateTenantAccess(tenantId, "readonly");

    // ✅ 2. RATE LIMITING
    await checkRateLimit(rateLimitPresets.api);

    // ✅ 3. QUERY - Sempre filtrar por tenantId
    const result = await db
      .select({ funil: lead.funil, count: count() })
      .from(lead)
      .where(eq(lead.tenantId, tenantId))
      .groupBy(lead.funil);

    return result;
  } catch (error) {
    console.error("[getLeadsCountByFunil Error]", error);
    throw error;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTAS DE IMPLEMENTAÇÃO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * CHECKLIST DE SEGURANÇA:
 *
 * ✅ Todos os funcs têm: validateTenantAccess()
 * ✅ Todos os funcs têm: checkRateLimit()
 * ✅ Todos os POSTs/PATCHs têm: Zod validation
 * ✅ Todas as queries têm: tenantId na condição
 * ✅ DELETE requer "admin" role
 * ✅ Erros são propagados (não hidden)
 *
 * ROLES:
 * - readonly: Apenas leitura
 * - assessor: Pode criar/editar
 * - admin: Pode deletar + gerenciar
 *
 * RATE LIMITS:
 * - api (read): 100 req/min
 * - form (write): 10 req/10min
 * - login: 5 req/15min
 */
