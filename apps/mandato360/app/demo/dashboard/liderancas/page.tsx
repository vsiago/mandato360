import { LiderancasPageContent } from "@/app/[tenant]/dashboard/liderancas/liderancas-content"
import { demoTenant, demoLiderancas, demoBairros } from "@/lib/demo-data"

export default function DemoLiderancasPage() {
  return (
    <LiderancasPageContent
      tenantId={demoTenant.id}
      initialData={demoLiderancas}
      bairros={demoBairros}
    />
  )
}
