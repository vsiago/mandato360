"use client"

import { Scale, Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { leisAprovadas } from "@/lib/mock-data"

export default function LeisAprovadasPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Leis Aprovadas</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Leis de autoria do mandato que foram aprovadas pela camara
        </p>
      </div>

      {/* Card de Resumo */}
      <Card className="mb-6 md:mb-8">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg bg-emerald-100">
              <Scale className="h-6 w-6 md:h-7 md:w-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Total de Leis Aprovadas</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{leisAprovadas.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Leis */}
      <div className="space-y-3 md:space-y-4">
        {leisAprovadas.map((lei) => (
          <Card key={lei.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 space-y-2 md:space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-primary">{lei.numero}</p>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">{lei.titulo}</h3>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{lei.descricao}</p>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground lg:flex-shrink-0">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Aprovada em {new Date(lei.data).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {leisAprovadas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scale className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma lei aprovada ainda</p>
            <p className="text-sm text-muted-foreground">
              As leis aprovadas aparecerão aqui
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
