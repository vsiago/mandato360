"use server"

import { db } from "@/lib/db";
import { lead } from "@/lib/db/schema";
import { eq, desc, and, ilike, count } from "drizzle-orm";
import { validateTenantAccess } from "@/lib/auth-utils";
import { leadSchemas } from "@/lib/validations";
import { checkRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function getLeads(tenantId: string, options?: { limit?: number; offset?: number; search?: string; funil?: string }) {
  try {
    // ✅ SECURITY: Validate tenant access
    const auth = await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    // ✅ SECURITY: Validate input with Zod
    const validated = leadSchemas.list.parse({
      tenantId,
      limit: options?.limit,
      offset: options?.offset,
      search: options?.search,
      funil: options?.funil,
    });

    const conditions = [eq(lead.tenantId, validated.tenantId)];

    if (validated.search) {
      conditions.push(ilike(lead.nome, `%${validated.search}%`));
    }

    if (validated.funil) {
      conditions.push(eq(lead.funil, validated.funil as any));
    }

    const result = await db.query.lead.findMany({
      where: and(...conditions),
      orderBy: desc(lead.createdAt),
      limit: validated.limit,
      offset: validated.offset,
      with: {
        // bairroRef desativado: lead.bairroId nao existe (o bairro vem da
        // coluna texto `bairro`). Pedir a relacao aqui derrubava getLeads
        // inteiro com "reading 'referencedTable'". Mesmo padrao de liderancas.ts.
        liderancaRef: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error; // ✅ Don't hide errors in production
  }
}

export async function getLeadById(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access
    await validateTenantAccess(tenantId, "readonly");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.api);

    const result = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
      with: { liderancaRef: true }
    });

    if (!result) {
      throw new Error("Lead not found or access denied");
    }

    return result;
  } catch (error) {
    console.error("Error fetching lead:", error);
    throw error;
  }
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
    // ✅ SECURITY: Validate tenant access (requires assessor role)
    await validateTenantAccess(data.tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Validate input with Zod
    const validated = leadSchemas.create.parse(data);

    const [result] = await db.insert(lead).values(validated).returning();
    return { success: true, data: result };
  } catch (error: any) {
    console.error("[Create Lead Error]", error);
    return { success: false, error: error.message || "Erro ao criar lead." };
  }
}

export async function updateLead(
  id: string,
  tenantId: string,
  data: Partial<{
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
  }>
) {
  try {
    // ✅ SECURITY: Validate tenant access (requires assessor role)
    await validateTenantAccess(tenantId, "assessor");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Validate input with Zod
    const validated = leadSchemas.update.parse({ id, tenantId, ...data });

    // ✅ SECURITY: Verify lead belongs to tenant
    const existingLead = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
    });

    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    const [result] = await db
      .update(lead)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(lead.id, id), eq(lead.tenantId, tenantId)))
      .returning();

    return { success: true, data: result };
  } catch (error: any) {
    console.error("[Update Lead Error]", error);
    return { success: false, error: error.message || "Erro ao atualizar lead." };
  }
}

export async function deleteLead(id: string, tenantId: string) {
  try {
    // ✅ SECURITY: Validate tenant access (requires admin role for deletion)
    await validateTenantAccess(tenantId, "admin");

    // ✅ SECURITY: Rate limiting
    await checkRateLimit(rateLimitPresets.form);

    // ✅ SECURITY: Verify lead belongs to tenant before deletion
    const existingLead = await db.query.lead.findFirst({
      where: and(eq(lead.id, id), eq(lead.tenantId, tenantId)),
    });

    if (!existingLead) {
      throw new Error("Lead not found or access denied");
    }

    await db.delete(lead).where(and(eq(lead.id, id), eq(lead.tenantId, tenantId)));
    return { success: true };
  } catch (error: any) {
    console.error("[Delete Lead Error]", error);
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
