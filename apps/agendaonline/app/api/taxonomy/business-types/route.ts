import { NextResponse } from "next/server"
import { getBusinessTypes } from "@/lib/taxonomy"

/** GET /api/taxonomy/business-types — Public list of business types (used by onboarding) */
export async function GET() {
    try {
        const types = await getBusinessTypes()
        return NextResponse.json(types)
    } catch {
        return NextResponse.json({ error: "Failed to load business types" }, { status: 500 })
    }
}
