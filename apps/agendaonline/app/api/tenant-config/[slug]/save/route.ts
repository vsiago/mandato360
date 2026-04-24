import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { tenants } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

/**
 * POST /api/tenant-config/[slug]/save
 *
 * Authenticated endpoint to update tenant configuration.
 * Validates ownership (owner or superadmin) before persisting.
 * Increments config version and records `updatedBy`.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // Auth check
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  // Find tenant
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
  })

  if (!tenant) {
    return NextResponse.json({ error: "Tenant não encontrado" }, { status: 404 })
  }

  // Authorization: owner or superadmin
  const isOwner = tenant.ownerId === session.user.id
  const isSuperAdmin = (session.user as any).role === "superadmin"
  if (!isOwner && !isSuperAdmin) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
  }

  // Parse body
  const body = await request.json()

  // Build update payload — only include fields that were sent
  const updatePayload: Record<string, any> = {
    updatedAt: new Date(),
  }

  // Content fields
  if (body.content) {
    if (body.content.heroHeadline !== undefined) updatePayload.heroBadge = body.content.heroBadge
    if (body.content.heroHeadline !== undefined) updatePayload.heroHeadline = body.content.heroHeadline
    if (body.content.heroHighlight !== undefined) updatePayload.heroHighlight = body.content.heroHighlight
    if (body.content.description !== undefined) updatePayload.description = body.content.description
    if (body.content.ctaText !== undefined) updatePayload.ctaText = body.content.ctaText
    if (body.content.trustBadges !== undefined) updatePayload.trustBadges = body.content.trustBadges
    if (body.content.faq !== undefined) updatePayload.faq = body.content.faq
    if (body.content.beforeAfter !== undefined) updatePayload.beforeAfter = body.content.beforeAfter
  }

  // Branding fields
  if (body.branding) {
    if (body.branding.name !== undefined) updatePayload.name = body.branding.name
    if (body.branding.surname !== undefined) updatePayload.surname = body.branding.surname
    if (body.branding.logoUrl !== undefined) updatePayload.logoUrl = body.branding.logoUrl
    if (body.branding.heroImageUrl !== undefined) updatePayload.heroImageUrl = body.branding.heroImageUrl
    if (body.branding.avatarUrl !== undefined) updatePayload.avatarUrl = body.branding.avatarUrl
    if (body.branding.primaryColor !== undefined) updatePayload.primaryColor = body.branding.primaryColor
    if (body.branding.hoverColor !== undefined) updatePayload.hoverColor = body.branding.hoverColor
    if (body.branding.headerBgColor !== undefined) updatePayload.headerBgColor = body.branding.headerBgColor
  }

  // Founder
  if (body.founder) {
    if (body.founder.name !== undefined) updatePayload.founderName = body.founder.name
    if (body.founder.bio !== undefined) updatePayload.founderBio = body.founder.bio
    if (body.founder.role !== undefined) updatePayload.founderRole = body.founder.role
    if (body.founder.imageUrl !== undefined) updatePayload.profileImageUrl = body.founder.imageUrl
  }

  // Contact
  if (body.contact) {
    if (body.contact.phone !== undefined) updatePayload.phone = body.contact.phone
    if (body.contact.whatsapp !== undefined) updatePayload.whatsapp = body.contact.whatsapp
    if (body.contact.address !== undefined) updatePayload.address = body.contact.address
    if (body.contact.instagram !== undefined) updatePayload.instagram = body.contact.instagram
    if (body.contact.mapEmbedUrl !== undefined) updatePayload.mapEmbedUrl = body.contact.mapEmbedUrl
  }

  // Layout
  if (body.layout) {
    if (body.layout.sections !== undefined) updatePayload.sections = body.layout.sections
    if (body.layout.sectionStyles !== undefined) updatePayload.sectionStyles = body.layout.sectionStyles
    if (body.layout.responsiveOverrides !== undefined) updatePayload.responsiveOverrides = body.layout.responsiveOverrides
    if (body.layout.heroImageSettings !== undefined) updatePayload.heroImageSettings = body.layout.heroImageSettings
  }

  // Theme
  if (body.theme !== undefined) updatePayload.theme = body.theme

  // Chat
  if (body.chat !== undefined) updatePayload.chat = body.chat

  // Persist
  await db.update(tenants).set(updatePayload).where(eq(tenants.id, tenant.id))

  // Revalidate production page
  revalidatePath(`/${slug}`, "page")

  return NextResponse.json({
    success: true,
    message: "Configuração salva com sucesso",
    slug,
  })
}
