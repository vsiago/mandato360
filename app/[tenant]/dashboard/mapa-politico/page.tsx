"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { eleitores, demandas, bairros } from "@/lib/mock-data"
import type { Eleitor } from "@/lib/mock-data"
import { MapPin, Users, Heart, AlertCircle, UserMinus, Phone } from "lucide-react"

// Coordenadas simuladas para cada bairro (posicao relativa no mapa)
const bairroCoords: Record<string, { x: number; y: number; citizens: { x: number; y: number }[] }> = {
  'Centro': { 
    x: 50, y: 50, 
    citizens: [
      { x: 48, y: 48 }, { x: 52, y: 50 }, { x: 50, y: 52 }, { x: 46, y: 51 }, { x: 54, y: 49 }
    ]
  },
  'Vila Nova': { 
    x: 25, y: 30, 
    citizens: [
      { x: 23, y: 28 }, { x: 27, y: 32 }, { x: 25, y: 30 }, { x: 22, y: 33 }
    ]
  },
  'Jardim América': { 
    x: 75, y: 35, 
    citizens: [
      { x: 73, y: 33 }, { x: 77, y: 37 }, { x: 75, y: 35 }, { x: 72, y: 38 }
    ]
  },
  'Santa Maria': { 
    x: 30, y: 70, 
    citizens: [
      { x: 28, y: 68 }, { x: 32, y: 72 }, { x: 30, y: 70 }, { x: 27, y: 73 }
    ]
  },
  'Parque Industrial': { 
    x: 70, y: 75, 
    citizens: [
      { x: 68, y: 73 }, { x: 72, y: 77 }, { x: 70, y: 75 }
    ]
  },
}

const statusColors: Record<string, string> = {
  'apoiador': '#22c55e',
  'simpatizante': '#eab308',
  'neutro': '#9ca3af',
  'problema': '#ef4444',
}

const statusLabels: Record<string, string> = {
  'apoiador': 'Apoiador',
  'simpatizante': 'Simpatizante',
  'neutro': 'Neutro',
  'problema': 'Com Problema',
}

export default function MapaPoliticoPage() {
  const [selectedCitizen, setSelectedCitizen] = useState<Eleitor | null>(null)
  const [filterBairro, setFilterBairro] = useState<string>("todos")
  const [filterStatus, setFilterStatus] = useState<string>("todos")

  // Estatisticas por bairro
  const statsByBairro = useMemo(() => {
    const stats: Record<string, { apoiadores: number; simpatizantes: number; neutros: number; problemas: number; total: number }> = {}
    
    bairros.forEach(bairro => {
      const bairroEleitores = eleitores.filter(e => e.bairro === bairro)
      stats[bairro] = {
        apoiadores: bairroEleitores.filter(e => e.statusRelacionamento === 'apoiador').length,
        simpatizantes: bairroEleitores.filter(e => e.statusRelacionamento === 'simpatizante').length,
        neutros: bairroEleitores.filter(e => e.statusRelacionamento === 'neutro').length,
        problemas: bairroEleitores.filter(e => e.statusRelacionamento === 'problema').length,
        total: bairroEleitores.length,
      }
    })
    
    return stats
  }, [])

  // Filtrar eleitores
  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      if (filterBairro !== "todos" && e.bairro !== filterBairro) return false
      if (filterStatus !== "todos" && e.statusRelacionamento !== filterStatus) return false
      return true
    })
  }, [filterBairro, filterStatus])

  // Obter demandas abertas do cidadao
  const getCitizenDemandas = (eleitorId: string) => {
    return demandas.filter(d => d.eleitorId === eleitorId && d.status !== 'resolvido')
  }

  // Totais gerais
  const totals = useMemo(() => ({
    apoiadores: eleitores.filter(e => e.statusRelacionamento === 'apoiador').length,
    simpatizantes: eleitores.filter(e => e.statusRelacionamento === 'simpatizante').length,
    neutros: eleitores.filter(e => e.statusRelacionamento === 'neutro').length,
    problemas: eleitores.filter(e => e.statusRelacionamento === 'problema').length,
  }), [])

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Mapa Politico</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visualize a distribuicao geografica dos cidadaos
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={filterBairro} onValueChange={setFilterBairro}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Bairro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Bairros</SelectItem>
            {bairros.map(b => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="apoiador">Apoiadores</SelectItem>
            <SelectItem value="simpatizante">Simpatizantes</SelectItem>
            <SelectItem value="neutro">Neutros</SelectItem>
            <SelectItem value="problema">Com Problema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">Apoiador ({totals.apoiadores})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-sm text-muted-foreground">Simpatizante ({totals.simpatizantes})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-400" />
          <span className="text-sm text-muted-foreground">Neutro ({totals.neutros})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground">Com Problema ({totals.problemas})</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-semibold">Mapa da Cidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-emerald-50 to-sky-50 rounded-xl overflow-hidden border">
                {/* Grid do mapa */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${(i + 1) * 10}%` }} />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${(i + 1) * 10}%` }} />
                  ))}
                </div>

                {/* Labels dos bairros */}
                {Object.entries(bairroCoords).map(([bairro, coords]) => (
                  <div
                    key={bairro}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground bg-white/80 px-2 py-0.5 rounded"
                    style={{ left: `${coords.x}%`, top: `${coords.y - 8}%` }}
                  >
                    {bairro}
                  </div>
                ))}

                {/* Pontos dos cidadaos */}
                {filteredEleitores.map((eleitor, index) => {
                  const bairroData = bairroCoords[eleitor.bairro]
                  if (!bairroData) return null
                  
                  const citizenCoord = bairroData.citizens[index % bairroData.citizens.length]
                  const offsetX = (Math.random() - 0.5) * 4
                  const offsetY = (Math.random() - 0.5) * 4

                  return (
                    <button
                      key={eleitor.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full transition-transform hover:scale-150 cursor-pointer shadow-md ring-2 ring-white"
                      style={{
                        left: `${citizenCoord.x + offsetX}%`,
                        top: `${citizenCoord.y + offsetY}%`,
                        backgroundColor: statusColors[eleitor.statusRelacionamento],
                      }}
                      onClick={() => setSelectedCitizen(eleitor)}
                      title={eleitor.nome}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Estatisticas por Bairro */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Resumo por Bairro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bairros.map(bairro => {
                  const stats = statsByBairro[bairro]
                  return (
                    <div key={bairro} className="p-3 rounded-xl bg-muted/50">
                      <p className="font-medium text-foreground mb-2">{bairro}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-emerald-500" />
                          <span className="text-muted-foreground">Apoiadores:</span>
                          <span className="font-semibold text-foreground">{stats.apoiadores}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-yellow-500" />
                          <span className="text-muted-foreground">Simpatizantes:</span>
                          <span className="font-semibold text-foreground">{stats.simpatizantes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserMinus className="h-3 w-3 text-gray-400" />
                          <span className="text-muted-foreground">Neutros:</span>
                          <span className="font-semibold text-foreground">{stats.neutros}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-muted-foreground">Problemas:</span>
                          <span className="font-semibold text-foreground">{stats.problemas}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Detalhes do Cidadao */}
      <Dialog open={!!selectedCitizen} onOpenChange={() => setSelectedCitizen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Cidadao</DialogTitle>
            <DialogDescription>Informacoes e demandas abertas</DialogDescription>
          </DialogHeader>
          {selectedCitizen && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: statusColors[selectedCitizen.statusRelacionamento] }}
                >
                  {selectedCitizen.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedCitizen.nome}</p>
                  <Badge className={
                    selectedCitizen.statusRelacionamento === 'apoiador' ? 'bg-emerald-50 text-emerald-700' :
                    selectedCitizen.statusRelacionamento === 'simpatizante' ? 'bg-yellow-50 text-yellow-700' :
                    selectedCitizen.statusRelacionamento === 'neutro' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-50 text-red-700'
                  }>
                    {statusLabels[selectedCitizen.statusRelacionamento]}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCitizen.bairro}</span>
                </div>
              </div>

              {/* Demandas Abertas */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Demandas Abertas</p>
                {getCitizenDemandas(selectedCitizen.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma demanda aberta.</p>
                ) : (
                  <div className="space-y-2">
                    {getCitizenDemandas(selectedCitizen.id).map(demanda => (
                      <div key={demanda.id} className="p-3 rounded-xl bg-muted/50">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-foreground">{demanda.tipo}</p>
                          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 text-xs">
                            {demanda.status === 'novo' ? 'Nova' : demanda.status === 'analise' ? 'Analise' : 'Encaminhada'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{demanda.descricao}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedCitizen(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
