import { PesquisasPageContent } from "@/app/[tenant]/dashboard/pesquisas/pesquisas-content"
import { demoTenant, demoPesquisas } from "@/lib/demo-data"

export default function DemoPesquisasPage() {
  return (
    <PesquisasPageContent
      tenantId={demoTenant.id}
      tenantSlug={demoTenant.slug}
      initialData={demoPesquisas}
    />
  )
}
