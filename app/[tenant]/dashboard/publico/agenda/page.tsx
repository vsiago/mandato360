import { getTenantBySlug } from "@/lib/actions/tenant"
import { getAgendas } from "@/lib/actions/agenda"
import { notFound } from "next/navigation"
import { AgendaPageContent } from "./agenda-content"

export default async function AgendaPage({ params }: { params: { tenant: string } }) {
  const { tenant: slug } = await params
  const tenantData = await getTenantBySlug(slug)
  if (!tenantData) return notFound()

  const data = await getAgendas(tenantData.id)
  return <AgendaPageContent tenantId={tenantData.id} initialData={data} />
}
