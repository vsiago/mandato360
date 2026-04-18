"use client"

import { Users, MessageSquareText, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { eleitores, demandas } from "@/lib/mock-data"

export function DashboardStats() {
  const totalEleitores = eleitores.length
  const totalDemandas = demandas.length
  const demandasResolvidas = demandas.filter(d => d.status === 'resolvido').length
  const demandasEmAndamento = demandas.filter(d => d.status === 'analise' || d.status === 'encaminhado').length

  const stats = [
    {
      label: "Total de Eleitores",
      value: totalEleitores,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Demandas Recebidas",
      value: totalDemandas,
      icon: MessageSquareText,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Demandas Resolvidas",
      value: demandasResolvidas,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Em Andamento",
      value: demandasEmAndamento,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col gap-3">
                <div className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 md:h-5.5 md:w-5.5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
