import { EleitoresPageContent } from "@/app/[tenant]/dashboard/eleitores/eleitores-content"
import { demoTenant, demoEleitores, demoBairros } from "@/lib/demo-data"

export default function DemoEleitoresPage() {
  return (
    <EleitoresPageContent
      tenantId={demoTenant.id}
      tenantSlug={demoTenant.slug}
      initialData={demoEleitores}
      bairros={demoBairros}
    />
  )
}
