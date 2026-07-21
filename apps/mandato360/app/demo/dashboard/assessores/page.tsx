import { AssessoresPageContent } from "@/app/[tenant]/dashboard/assessores/assessores-content"
import { demoTenant, demoAssessores } from "@/lib/demo-data"

export default function DemoAssessoresPage() {
  return (
    <AssessoresPageContent
      tenantId={demoTenant.id}
      initialData={demoAssessores}
    />
  )
}
