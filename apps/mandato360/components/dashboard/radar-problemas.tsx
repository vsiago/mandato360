"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { demandas } from "@/lib/mock-data"
import { AlertTriangle } from "lucide-react"

export function RadarProblemas() {
  const ranking = useMemo(() => {
    // Agrupa demandas por tipo e conta
    const contagem = demandas.reduce((acc, demanda) => {
      acc[demanda.tipo] = (acc[demanda.tipo] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Converte para array e ordena
    return Object.entries(contagem)
      .map(([tipo, quantidade]) => ({ tipo, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
  }, [])

  const maxQuantidade = ranking[0]?.quantidade || 1

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          Radar de Problemas da Cidade
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-4">
          Problemas mais citados pela populacao
        </p>
        <div className="space-y-3">
          {ranking.map((item, index) => (
            <div key={item.tipo} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-medium">{index + 1}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.tipo}</span>
                  <span className="text-sm text-muted-foreground">{item.quantidade} pedidos</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(item.quantidade / maxQuantidade) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
