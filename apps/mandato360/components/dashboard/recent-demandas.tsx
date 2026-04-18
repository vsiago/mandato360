"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { demandas } from "@/lib/mock-data"

// Format date consistently to avoid hydration mismatch
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

const statusConfig = {
  novo: { label: 'Novo', variant: 'default' as const, className: 'bg-primary/10 text-primary hover:bg-primary/10' },
  analise: { label: 'Em Analise', variant: 'secondary' as const, className: 'bg-amber-50 text-amber-700 hover:bg-amber-50' },
  encaminhado: { label: 'Encaminhado', variant: 'secondary' as const, className: 'bg-accent/10 text-accent hover:bg-accent/10' },
  resolvido: { label: 'Resolvido', variant: 'secondary' as const, className: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' },
}

export function RecentDemandas() {
  const recentDemandas = demandas.slice(0, 5)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg font-semibold">Ultimas Solicitacoes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDemandas.map((demanda) => {
            const status = statusConfig[demanda.status]
            return (
              <div
                key={demanda.id}
                className="flex items-start justify-between gap-4 rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{demanda.eleitorNome}</p>
                    <Badge className={status.className}>{status.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{demanda.tipo} - {demanda.bairro}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{demanda.descricao}</p>
                </div>
                <div className="shrink-0 text-right text-xs md:text-sm text-muted-foreground">
                  {formatDate(demanda.data)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
