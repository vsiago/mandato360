import { BairrosPageContent } from "@/app/[tenant]/dashboard/bairros/bairros-content"
import { demoTenant, demoBairros } from "@/lib/demo-data"

export default function DemoBairrosPage() {
  return (
    <BairrosPageContent
      tenantId={demoTenant.id}
      initialData={demoBairros}
    />
  )
}
