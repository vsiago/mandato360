import { getTenantBySlug } from "@/lib/actions/tenant"
import { notFound } from "next/navigation"
import { QuemSouContent } from "./quem-sou-content"

export default async function QuemSouPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  return <QuemSouContent tenant={tenantData} />
}
