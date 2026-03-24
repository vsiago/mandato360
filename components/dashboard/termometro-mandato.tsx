"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { demandas, eleitores, bairros } from "@/lib/mock-data"
import { TrendingUp, CheckCircle2, Users, MapPin } from "lucide-react"

export function TermometroMandato() {
  const metricas = useMemo(() => {
    // Percentual de demandas resolvidas
    const totalDemandas = demandas.length
    const demandasResolvidas = demandas.filter(d => d.status === 'resolvido').length
    const percentualResolvidas = totalDemandas > 0 ? Math.round((demandasResolvidas / totalDemandas) * 100) : 0

    // Percentual de cidadaos respondidos (que tiveram pelo menos uma demanda resolvida)
    const eleitorComDemandaResolvida = new Set(demandas.filter(d => d.status === 'resolvido').map(d => d.eleitorId))
    const eleitorComDemanda = new Set(demandas.map(d => d.eleitorId))
    const percentualCidadaosRespondidos = eleitorComDemanda.size > 0 
      ? Math.round((eleitorComDemandaResolvida.size / eleitorComDemanda.size) * 100) 
      : 0

    // Percentual de bairros atendidos
    const bairrosComDemandaResolvida = new Set(demandas.filter(d => d.status === 'resolvido').map(d => d.bairro))
    const percentualBairrosAtendidos = bairros.length > 0 
      ? Math.round((bairrosComDemandaResolvida.size / bairros.length) * 100) 
      : 0

    // Score geral (media ponderada)
    const score = Math.round((percentualResolvidas * 0.4) + (percentualCidadaosRespondidos * 0.35) + (percentualBairrosAtendidos * 0.25))

    return {
      score,
      percentualResolvidas,
      percentualCidadaosRespondidos,
      percentualBairrosAtendidos,
      demandasResolvidas,
      totalDemandas,
    }
  }, [])

  // Cor do score baseado no valor
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-500', light: 'bg-emerald-50' }
    if (score >= 60) return { bg: 'bg-primary', text: 'text-primary', light: 'bg-primary/10' }
    if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50' }
    return { bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-50' }
  }

  const scoreColor = getScoreColor(metricas.score)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Termometro do Mandato
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {/* Score principal */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - metricas.score / 100)}`}
                strokeLinecap="round"
                className={scoreColor.text}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor.text}`}>{metricas.score}</span>
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-sm text-muted-foreground">Demandas Resolvidas</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold">{metricas.percentualResolvidas}%</span>
              <p className="text-xs text-muted-foreground">{metricas.demandasResolvidas}/{metricas.totalDemandas}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Cidadaos Respondidos</span>
            </div>
            <span className="text-lg font-semibold">{metricas.percentualCidadaosRespondidos}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">Bairros Atendidos</span>
            </div>
            <span className="text-lg font-semibold">{metricas.percentualBairrosAtendidos}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
