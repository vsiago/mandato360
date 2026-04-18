"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { assessores } from "@/lib/mock-data"
import { Trophy, User } from "lucide-react"

export function RankingAssessores() {
  // Ordena assessores ativos por demandas resolvidas
  const ranking = [...assessores]
    .filter(a => a.status === 'ativo')
    .sort((a, b) => b.demandasResolvidas - a.demandasResolvidas)
    .slice(0, 4)

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-amber-100 text-amber-700 border-amber-200'
      case 1: return 'bg-gray-100 text-gray-600 border-gray-200'
      case 2: return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Ranking de Assessores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-xs text-muted-foreground mb-4">
          Produtividade da equipe do gabinete
        </p>
        <div className="space-y-3">
          {ranking.map((assessor, index) => (
            <div key={assessor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${getMedalColor(index)}`}>
                {index < 3 ? (
                  <span className="text-sm font-bold">{index + 1}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{assessor.nome}</p>
                <p className="text-xs text-muted-foreground">{assessor.cargo}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-emerald-600">{assessor.demandasResolvidas}</p>
                <p className="text-[10px] text-muted-foreground">resolvidas</p>
              </div>
              <Badge variant="secondary" className="text-xs shrink-0">
                {assessor.demandasEmAndamento} em andamento
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
