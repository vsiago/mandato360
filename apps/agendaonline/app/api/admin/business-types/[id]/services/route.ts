import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { globalServices, globalPlaceholders, globalCategories } from "@/db/schema"
import { eq, asc } from "drizzle-orm"
import { requireAdmin } from "@/lib/admin-guard"

function slugify(text: string): string {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

/** GET /api/admin/business-types/[id]/services — List services for a business type */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id } = await params
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
            placeholder: globalPlaceholders.placeholderText,
        })
        .from(globalServices)
        .leftJoin(globalPlaceholders, eq(globalPlaceholders.globalServiceId, globalServices.id))
        .where(eq(globalServices.businessTypeId, id))
        .orderBy(asc(globalServices.sortOrder))

    return NextResponse.json(services)
}

/** POST /api/admin/business-types/[id]/services — Create a service (with placeholder) */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error } = await requireAdmin()
    if (error) return error

    const { id: businessTypeId } = await params
    const body = await request.json()
    const { name, categoryId, defaultDuration, defaultPrice, defaultDescription, sortOrder, placeholder } = body

    if (!name || !categoryId) {
        return NextResponse.json({ error: "name and categoryId are required" }, { status: 400 })
    }

    const slug = slugify(name)
    const svcId = `gs-${slugify(businessTypeId)}-${slug}`

    const [createdService] = await db.insert(globalServices).values({
        id: svcId,
        businessTypeId,
        globalCategoryId: categoryId,
        name,
        slug,
        defaultDuration: defaultDuration ?? 60,
        defaultPrice: defaultPrice ?? null,
        defaultDescription: defaultDescription ?? null,
        sortOrder: sortOrder ?? 0,
    }).returning()

    // Create placeholder if provided
    if (placeholder) {
        const phId = `gp-${slugify(businessTypeId)}-${slug}`
        await db.insert(globalPlaceholders).values({
            id: phId,
            globalServiceId: svcId,
            placeholderText: placeholder,
        })
    }

    return NextResponse.json(createdService, { status: 201 })
}
