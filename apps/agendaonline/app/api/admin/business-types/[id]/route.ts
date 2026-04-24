import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { businessTypes, globalCategories, globalServices, globalPlaceholders } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin-guard"

/** GET /api/admin/business-types/[id] — Get single business type with categories & services */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const bt = await db.query.businessTypes.findFirst({
        where: eq(businessTypes.id, id),
    })

    if (!bt) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const categories = await db
        .select()
        .from(globalCategories)
        .where(eq(globalCategories.businessTypeId, id))

    const services = await db
        .select({
            id: globalServices.id,
            name: globalServices.name,
            slug: globalServices.slug,
            categoryId: globalServices.globalCategoryId,
            defaultDuration: globalServices.defaultDuration,
            defaultPrice: globalServices.defaultPrice,
            defaultDescription: globalServices.defaultDescription,
            sortOrder: globalServices.sortOrder,
        })
        .from(globalServices)
        .where(eq(globalServices.businessTypeId, id))

    return NextResponse.json({ ...bt, categories, services })
}

/** PUT /api/admin/business-types/[id] — Update a business type */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
    const body = await request.json()

    const existing = await db.query.businessTypes.findFirst({
        where: eq(businessTypes.id, id),
    })
    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const [updated] = await db
        .update(businessTypes)
        .set({
            name: body.name ?? existing.name,
            icon: body.icon ?? existing.icon,
            emoji: body.emoji ?? existing.emoji,
            description: body.description ?? existing.description,
            sortOrder: body.sortOrder ?? existing.sortOrder,
        })
        .where(eq(businessTypes.id, id))
        .returning()

    return NextResponse.json(updated)
}

/** DELETE /api/admin/business-types/[id] — Delete a business type (cascade) */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params

    // Delete in order: placeholders → services → categories → business type
    const svcs = await db.select().from(globalServices).where(eq(globalServices.businessTypeId, id))
    for (const svc of svcs) {
        await db.delete(globalPlaceholders).where(eq(globalPlaceholders.globalServiceId, svc.id))
    }
    await db.delete(globalServices).where(eq(globalServices.businessTypeId, id))
    await db.delete(globalCategories).where(eq(globalCategories.businessTypeId, id))
    await db.delete(businessTypes).where(eq(businessTypes.id, id))

    return NextResponse.json({ success: true })
}
