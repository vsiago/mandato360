import { getTenantBySlug } from "@/lib/actions/tenant"
import { notFound } from "next/navigation"
import { HeroPageContent } from "./hero-content"

export default async function HeroPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  return <HeroPageContent tenant={tenantData} />
}
