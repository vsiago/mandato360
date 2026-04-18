import { getTenantBySlug } from "@/lib/actions/tenant"
import { getLeads } from "@/lib/actions/leads"
import { notFound } from "next/navigation"
import { LeadsPageContent } from "./leads-content"

export default async function LeadsPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getLeads(tenantData.id)
  return <LeadsPageContent tenantId={tenantData.id} initialData={data} />
}
