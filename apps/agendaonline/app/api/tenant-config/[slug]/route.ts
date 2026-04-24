import { NextRequest, NextResponse } from "next/server"
import { buildTenantConfig } from "@/lib/tenant-config-builder"

/**
 * GET /api/tenant-config/[slug]
 *
 * Public endpoint that returns the complete TenantConfig for a given slug.
 * This is the SINGLE API for reading tenant configuration.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 }
    )
  }

  const config = await buildTenantConfig(slug)

  if (!config) {
    return NextResponse.json(
      { error: "Tenant not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
