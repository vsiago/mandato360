"use server"

import { db } from "@/lib/db";
import { tenant, tenantMember, user, eleitor, demanda, lideranca, legislativo, publicacao } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTenantBySlug(slug: string) {
  try {
    console.time(`getTenantBySlug:${slug}`);
    const result = await db.query.tenant.findFirst({
      where: eq(tenant.slug, slug),
    });
    console.timeEnd(`getTenantBySlug:${slug}`);
    return result;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

export async function getAllTenants() {
  return await db.query.tenant.findMany();
}

export async function createTenant(data: { 
    name: string; 
    slug: string; 
    primaryColor?: string;
    secondaryColor?: string;
    fotoPerfilUrl?: string;
    biografia?: string;
    logoUrl?: string;
    config?: string 
}) {
  try {
    const result = await db.insert(tenant).values({
      name: data.name,
      slug: data.slug,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      fotoPerfilUrl: data.fotoPerfilUrl,
      biografia: data.biografia,
      logoUrl: data.logoUrl,
      config: data.config,
      updatedAt: new Date(),
    }).returning();
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("Error creating tenant:", error);
    if (error.code === '23505') {
      return { success: false, error: "Este slug já está em uso." };
    }
    return { success: false, error: "Erro ao criar mandato." };
  }
}export async function createTenantWithOwner(data: { 
  name: string; 
  slug: string; 
  primaryColor?: string;
  secondaryColor?: string;
  fotoPerfilUrl?: string;
  biografia?: string;
  logoUrl?: string;
  config?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}) {
  try {
    console.time("createTenantWithOwner:auth");
    const authResult = await auth.api.signUpEmail({
      body: {
        email: data.ownerEmail,
        password: data.ownerPassword,
        name: data.ownerName,
      },
      headers: await headers()
    }).catch(err => {
      console.error("Better Auth Error:", err);
      // Extrair mensagem de erro amigável se disponível
      const msg = err.message || "Erro ao criar usuário proprietário.";
      throw new Error(msg);
    });
    console.timeEnd("createTenantWithOwner:auth");

    if (!authResult || !authResult.user) {
      throw new Error("Falha ao criar usuário proprietário.");
    }

    // 2. Create Tenant and Membership in a single transaction
    console.time("createTenantWithOwner:db");
    return await db.transaction(async (tx) => {
      // Create Tenant
      const [newTenant] = await tx.insert(tenant).values({
        name: data.name,
        slug: data.slug,
        primaryColor: data.primaryColor || "#0F2B5B",
        secondaryColor: data.secondaryColor || "#0D9F6E",
        fotoPerfilUrl: data.fotoPerfilUrl,
        biografia: data.biografia,
        logoUrl: data.logoUrl,
        config: data.config,
        updatedAt: new Date(),
      }).returning();

      // Create Tenant Membership as Owner
      await tx.insert(tenantMember).values({
        tenantId: newTenant.id,
        userId: authResult.user.id,
        role: "owner",
      });

      return { success: true, data: { tenant: newTenant, user: authResult.user } };
    }).finally(() => {
        console.timeEnd("createTenantWithOwner:db");
    });
  } catch (error: any) {
    console.error("Error creating tenant and owner:", error);
    if (error.code === '23505') {
      if (error.constraint_name?.includes('tenant_slug_key')) {
        return { success: false, error: "Este slug já está em uso." };
      }
      if (error.constraint_name?.includes('user_email_key')) {
        return { success: false, error: "Este e-mail já está em uso." };
      }
    }
    return { success: false, error: error.message || "Erro ao processar cadastro." };
  }
}

export async function updateTenant(id: string, data: { 
    name?: string; 
    slug?: string; 
    primaryColor?: string;
    secondaryColor?: string;
    fotoPerfilUrl?: string;
    biografia?: string;
    logoUrl?: string;
    config?: string 
}) {
  try {
    const result = await db.update(tenant)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(tenant.id, id))
      .returning();
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("Error updating tenant:", error);
    if (error.code === '23505') {
      return { success: false, error: "Este slug já está em uso." };
    }
    return { success: false, error: "Erro ao atualizar mandato." };
  }
}

export async function deleteTenant(id: string) {
  try {
    await db.transaction(async (tx) => {
      // Manual cascade for linked tables if not set in DB
      // In a real app, DB level cascade is better, but here we ensure it works
      await tx.delete(tenantMember).where(eq(tenantMember.tenantId, id));
      await tx.delete(demanda).where(eq(demanda.tenantId, id));
      await tx.delete(eleitor).where(eq(eleitor.tenantId, id));
      await tx.delete(lideranca).where(eq(lideranca.tenantId, id));
      await tx.delete(legislativo).where(eq(legislativo.tenantId, id));
      await tx.delete(publicacao).where(eq(publicacao.tenantId, id));
      
      await tx.delete(tenant).where(eq(tenant.id, id));
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return { success: false, error: "Erro ao excluir mandato." };
  }
}

export async function updateTenantSiteAction(slug: string, configData: any) {
  try {
    const isModel = slug === "vereador";
    if (isModel) {
      return { success: false, error: "O vereador modelo não pode ser editado." };
    }

    const [updated] = await db.update(tenant)
      .set({
        config: JSON.stringify(configData),
        primaryColor: configData.colors?.primary,
        secondaryColor: configData.colors?.secondary,
        biografia: configData.perfil?.bio,
        fotoPerfilUrl: configData.perfil?.imageUrl,
        logoUrl: configData.logoUrl,
        updatedAt: new Date(),
      })
      .where(eq(tenant.slug, slug))
      .returning();

    if (!updated) {
      return { success: false, error: "Mandato não encontrado." };
    }

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating tenant site config:", error);
    return { success: false, error: "Erro ao salvar configurações do site." };
  }
}
