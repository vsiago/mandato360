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
import { MapPin, Phone, User, AlertCircle, Heart, Users, HelpCircle, Filter } from "lucide-react"

const statusConfig = {
  apoiador: { label: 'Apoiador', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50' },
  simpatizante: { label: 'Simpatizante', color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50' },
  neutro: { label: 'Neutro', color: 'bg-gray-400', textColor: 'text-gray-600', bgLight: 'bg-gray-50' },
  problema: { label: 'Com Demanda', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
}

// Coordenadas simuladas para os bairros (posicoes no mapa)
const bairroCoords: Record<string, { x: number; y: number; width: number; height: number }> = {
  'Centro': { x: 35, y: 30, width: 30, height: 25 },
  'Vila Nova': { x: 10, y: 20, width: 25, height: 30 },
  'Jardim América': { x: 65, y: 20, width: 25, height: 30 },
  'Santa Maria': { x: 20, y: 55, width: 30, height: 25 },
  'Parque Industrial': { x: 55, y: 55, width: 35, height: 30 },
}

// Gera posicoes aleatorias dentro de cada bairro para os cidadaos
function getRandomPosition(bairro: string, index: number) {
  const coords = bairroCoords[bairro] || { x: 50, y: 50, width: 20, height: 20 }
  const seed = index * 7 + bairro.length
  const offsetX = (seed % 10) / 10 * coords.width
  const offsetY = ((seed * 3) % 10) / 10 * coords.height
  return {
    x: coords.x + offsetX,
    y: coords.y + offsetY,
  }
}

export default function MapaEleitoralPage() {
  const [selectedEleitor, setSelectedEleitor] = useState<Eleitor | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroBairro, setFiltroBairro] = useState<string>("todos")

  // Estatisticas por bairro
  const estatisticasBairro = useMemo(() => {
    return bairros.reduce((acc, bairro) => {
      const eleitorsBairro = eleitores.filter(e => e.bairro === bairro)
      acc[bairro] = {
        apoiadores: eleitorsBairro.filter(e => e.statusRelacionamento === 'apoiador').length,
        simpatizantes: eleitorsBairro.filter(e => e.statusRelacionamento === 'simpatizante').length,
        neutros: eleitorsBairro.filter(e => e.statusRelacionamento === 'neutro').length,
        problemas: eleitorsBairro.filter(e => e.statusRelacionamento === 'problema').length,
        total: eleitorsBairro.length,
      }
      return acc
    }, {} as Record<string, { apoiadores: number; simpatizantes: number; neutros: number; problemas: number; total: number }>)
  }, [])

  // Filtra eleitores
  const eleitoresFiltrados = useMemo(() => {
    return eleitores.filter(e => {
      if (filtroStatus !== "todos" && e.statusRelacionamento !== filtroStatus) return false
      if (filtroBairro !== "todos" && e.bairro !== filtroBairro) return false
      return true
    })
  }, [filtroStatus, filtroBairro])

  // Demandas abertas do eleitor selecionado
  const demandasAbertas = useMemo(() => {
    if (!selectedEleitor) return []
    return demandas.filter(d => d.eleitorId === selectedEleitor.id && d.status !== 'resolvido')
  }, [selectedEleitor])

  // Totais gerais
  const totais = useMemo(() => ({
    apoiadores: eleitores.filter(e => e.statusRelacionamento === 'apoiador').length,
    simpatizantes: eleitores.filter(e => e.statusRelacionamento === 'simpatizante').length,
    neutros: eleitores.filter(e => e.statusRelacionamento === 'neutro').length,
    problemas: eleitores.filter(e => e.statusRelacionamento === 'problema').length,
  }), [])

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Mapa Eleitoral Inteligente</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visualize sua base politica geograficamente
        </p>
      </div>

      {/* Totais Gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Heart className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totais.apoiadores}</p>
              <p className="text-xs text-muted-foreground">Apoiadores</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totais.simpatizantes}</p>
              <p className="text-xs text-muted-foreground">Simpatizantes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totais.neutros}</p>
              <p className="text-xs text-muted-foreground">Neutros</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totais.problemas}</p>
              <p className="text-xs text-muted-foreground">Com Demandas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros:</span>
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="apoiador">Apoiadores</SelectItem>
                <SelectItem value="simpatizante">Simpatizantes</SelectItem>
                <SelectItem value="neutro">Neutros</SelectItem>
                <SelectItem value="problema">Com Demandas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroBairro} onValueChange={setFiltroBairro}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Bairros</SelectItem>
                {bairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mapa */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mapa da Cidade</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative aspect-[4/3] bg-muted/30 rounded-xl overflow-hidden border">
              {/* Areas dos bairros */}
              {Object.entries(bairroCoords).map(([bairro, coords]) => (
                <div
                  key={bairro}
                  className="absolute border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-end justify-center p-2"
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    width: `${coords.width}%`,
                    height: `${coords.height}%`,
                  }}
                >
                  <span className="text-[10px] md:text-xs font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                    {bairro}
                  </span>
                </div>
              ))}

              {/* Pontos dos eleitores */}
              {eleitoresFiltrados.map((eleitor, index) => {
                const pos = getRandomPosition(eleitor.bairro, index)
                const config = statusConfig[eleitor.statusRelacionamento]
                return (
                  <button
                    key={eleitor.id}
                    className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${config.color} border-2 border-white shadow-md hover:scale-150 transition-transform cursor-pointer z-10`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => setSelectedEleitor(eleitor)}
                    title={eleitor.nome}
                  />
                )
              })}

              {/* Legenda */}
              <div className="absolute bottom-2 left-2 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-sm border">
                <p className="text-[10px] font-medium mb-1.5">Legenda</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                      <span className="text-[10px] text-muted-foreground">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo por Bairro */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumo por Bairro</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {bairros.map(bairro => {
                const stats = estatisticasBairro[bairro]
                return (
                  <div key={bairro} className="p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{bairro}</span>
                      <span className="text-xs text-muted-foreground">{stats.total} cidadaos</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">Apoiadores:</span>
                        <span className="font-medium">{stats.apoiadores}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">Simpatizantes:</span>
                        <span className="font-medium">{stats.simpatizantes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                        <span className="text-muted-foreground">Neutros:</span>
                        <span className="font-medium">{stats.neutros}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">Problemas:</span>
                        <span className="font-medium">{stats.problemas}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de detalhes do eleitor */}
      <Dialog open={!!selectedEleitor} onOpenChange={() => setSelectedEleitor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Cidadao</DialogTitle>
            <DialogDescription>Informacoes e demandas abertas</DialogDescription>
          </DialogHeader>
          {selectedEleitor && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{selectedEleitor.nome}</p>
                  <Badge className={`mt-1 ${statusConfig[selectedEleitor.statusRelacionamento].bgLight} ${statusConfig[selectedEleitor.statusRelacionamento].textColor}`}>
                    {statusConfig[selectedEleitor.statusRelacionamento].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{selectedEleitor.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedEleitor.bairro}</span>
                </div>
              </div>

              {demandasAbertas.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Demandas Abertas ({demandasAbertas.length})
                  </p>
                  <div className="space-y-2">
                    {demandasAbertas.map(demanda => (
                      <div key={demanda.id} className="p-2 rounded-lg bg-red-50 text-sm">
                        <p className="font-medium text-red-700">{demanda.tipo}</p>
                        <p className="text-red-600 text-xs line-clamp-2">{demanda.descricao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full" variant="outline" onClick={() => setSelectedEleitor(null)}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
