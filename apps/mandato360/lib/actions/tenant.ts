"use server"

import { db } from "@/lib/db";
import { tenant, tenantMember, user, lead as eleitor, demanda, lideranca, legislativo, publicacao, account, session } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requirePlatformAdmin, validateTenantAccess } from "@/lib/auth-utils";

export async function getTenantBySlug(slug: string) {
  try {
    const result = await db.query.tenant.findFirst({
      where: eq(tenant.slug, slug),
    });
    return result;
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }
}

// Lista TODOS os mandatos da plataforma: exclusivo do superadmin.
export async function getAllTenants() {
  await requirePlatformAdmin();
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
    await requirePlatformAdmin();

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
    // Cadastra um mandato novo E cria o usuario dono dele: so o superadmin.
    await requirePlatformAdmin();

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

    if (!authResult || !authResult.user) {
      throw new Error("Falha ao criar usuário proprietário.");
    }

    // 2. Create Tenant and Membership in a single transaction
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
    config?: string;
    heroHeadline?: string;
    heroHighlight?: string;
    heroBadge?: string;
    heroImageUrl?: string;
    heroDescription?: string;
    heroCtaText?: string;
    tagline?: string;
    partido?: string;
    cidade?: string;
    cargo?: string;
    whatsapp?: string;
    telefone?: string;
    email?: string;
    instagram?: string;
    endereco?: string;
    showLeis?: boolean;
    showIndicacoes?: boolean;
    showAgenda?: boolean;
    destaques?: { text: string; icon?: string }[];
}) {
  try {
    // Edicao administrativa do mandato (inclusive slug): so o superadmin.
    // O proprio vereador edita o site dele por updateTenantSiteAction.
    await requirePlatformAdmin();

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
    // DESTRUTIVO: apaga o mandato e TODO o dado dele (eleitores, demandas,
    // liderancas...). Restrito ao superadmin.
    await requirePlatformAdmin();

    await db.transaction(async (tx) => {
      // Find all users that are members of this tenant before deleting
      const members = await tx.select({ userId: tenantMember.userId }).from(tenantMember).where(eq(tenantMember.tenantId, id));

      // Manual cascade for linked tables if not set in DB
      // In a real app, DB level cascade is better, but here we ensure it works
      await tx.delete(tenantMember).where(eq(tenantMember.tenantId, id));
      await tx.delete(demanda).where(eq(demanda.tenantId, id));
      await tx.delete(eleitor).where(eq(eleitor.tenantId, id));
      await tx.delete(lideranca).where(eq(lideranca.tenantId, id));
      await tx.delete(legislativo).where(eq(legislativo.tenantId, id));
      await tx.delete(publicacao).where(eq(publicacao.tenantId, id));
      
      await tx.delete(tenant).where(eq(tenant.id, id));

      // Purge orphaned users
      for (const m of members) {
        const otherMemberships = await tx.select().from(tenantMember).where(eq(tenantMember.userId, m.userId));
        if (otherMemberships.length === 0) {
           await tx.delete(session).where(eq(session.userId, m.userId));
           await tx.delete(account).where(eq(account.userId, m.userId));
           await tx.delete(user).where(eq(user.id, m.userId));
        }
      }
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

    // O proprio mandato edita seu site — exige vinculo com ESTE tenant,
    // senao qualquer um reescreveria a landing de outro vereador pelo slug.
    const alvo = await db.query.tenant.findFirst({ where: eq(tenant.slug, slug) });
    if (!alvo) {
      return { success: false, error: "Mandato não encontrado." };
    }
    await validateTenantAccess(alvo.id, "admin");

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

    // Clear cache for both the landing page and the editor
    revalidatePath(`/${slug}`);
    revalidatePath(`/${slug}/dashboard/editar-site`);

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating tenant site config:", error);
    return { success: false, error: "Erro ao salvar configurações do site." };
  }
}
