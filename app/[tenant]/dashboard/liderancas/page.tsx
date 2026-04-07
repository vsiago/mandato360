"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { liderancas as initialLiderancas, bairros } from "@/lib/mock-data"
import type { Lideranca } from "@/lib/mock-data"
import { Plus, Search, Phone, MapPin, Users, Crown, Church, Store, Building, UserCheck, MoreHorizontal, Eye, Pencil } from "lucide-react"

const tipoConfig = {
  lider_comunitario: { label: 'Lider Comunitario', icon: Crown, className: 'bg-primary/10 text-primary' },
  religioso: { label: 'Lider Religioso', icon: Church, className: 'bg-purple-50 text-purple-700' },
  comerciante: { label: 'Comerciante', icon: Store, className: 'bg-amber-50 text-amber-700' },
  sindico: { label: 'Sindico', icon: Building, className: 'bg-blue-50 text-blue-700' },
  presidente_associacao: { label: 'Presidente de Associacao', icon: UserCheck, className: 'bg-emerald-50 text-emerald-700' },
  outro: { label: 'Outro', icon: MoreHorizontal, className: 'bg-gray-50 text-gray-600' },
}

export default function LiderancasPage() {
  const [liderancas, setLiderancas] = useState<Lideranca[]>(initialLiderancas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroBairro, setFiltroBairro] = useState<string>("todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedLideranca, setSelectedLideranca] = useState<Lideranca | null>(null)

  // Novo formulario
  const [novaLideranca, setNovaLideranca] = useState({
    nome: '',
    telefone: '',
    bairro: '',
    tipo: '' as Lideranca['tipo'] | '',
    influenciaEstimada: '',
    anotacoes: '',
  })

  // Filtra liderancas
  const liderancasFiltradas = liderancas.filter(l => {
    if (searchTerm && !l.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (filtroTipo !== "todos" && l.tipo !== filtroTipo) return false
    if (filtroBairro !== "todos" && l.bairro !== filtroBairro) return false
    return true
  })

  // Estatisticas
  const totalLiderancas = liderancas.length
  const porTipo = Object.keys(tipoConfig).reduce((acc, tipo) => {
    acc[tipo] = liderancas.filter(l => l.tipo === tipo).length
    return acc
  }, {} as Record<string, number>)

  // Adicionar lideranca
  const handleAddLideranca = () => {
    if (!novaLideranca.nome || !novaLideranca.telefone || !novaLideranca.bairro || !novaLideranca.tipo) return

    const newLideranca: Lideranca = {
      id: String(Date.now()),
      nome: novaLideranca.nome,
      telefone: novaLideranca.telefone,
      bairro: novaLideranca.bairro,
      tipo: novaLideranca.tipo as Lideranca['tipo'],
      influenciaEstimada: novaLideranca.influenciaEstimada,
      anotacoes: novaLideranca.anotacoes,
      dataCadastro: new Date().toISOString().split('T')[0],
    }

    setLiderancas([newLideranca, ...liderancas])
    setNovaLideranca({ nome: '', telefone: '', bairro: '', tipo: '', influenciaEstimada: '', anotacoes: '' })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Liderancas</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Pessoas influentes da cidade
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Lideranca
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Lideranca</DialogTitle>
              <DialogDescription>Cadastre uma pessoa influente da cidade</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novaLideranca.nome}
                  onChange={(e) => setNovaLideranca({ ...novaLideranca, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novaLideranca.telefone}
                  onChange={(e) => setNovaLideranca({ ...novaLideranca, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Select
                    value={novaLideranca.bairro}
                    onValueChange={(value) => setNovaLideranca({ ...novaLideranca, bairro: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {bairros.map(bairro => (
                        <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Lideranca</Label>
                  <Select
                    value={novaLideranca.tipo}
                    onValueChange={(value) => setNovaLideranca({ ...novaLideranca, tipo: value as Lideranca['tipo'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipoConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="influencia">Influencia Estimada</Label>
                <Input
                  id="influencia"
                  value={novaLideranca.influenciaEstimada}
                  onChange={(e) => setNovaLideranca({ ...novaLideranca, influenciaEstimada: e.target.value })}
                  placeholder="Ex: 200 familias, 500 membros"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anotacoes">Anotacoes do Gabinete</Label>
                <Textarea
                  id="anotacoes"
                  value={novaLideranca.anotacoes}
                  onChange={(e) => setNovaLideranca({ ...novaLideranca, anotacoes: e.target.value })}
                  placeholder="Observacoes importantes..."
                  rows={3}
                />
              </div>
              <Button className="w-full" onClick={handleAddLideranca}>
                Cadastrar Lideranca
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatisticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalLiderancas}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        {Object.entries(tipoConfig).slice(0, 5).map(([key, config]) => {
          const Icon = config.icon
          return (
            <Card key={key} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg ${config.className} flex items-center justify-center`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{porTipo[key] || 0}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar lideranca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                {Object.entries(tipoConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroBairro} onValueChange={setFiltroBairro}>
              <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Tabela */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Bairro</TableHead>
                  <TableHead className="hidden lg:table-cell">Influencia</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liderancasFiltradas.map((lideranca) => {
                  const config = tipoConfig[lideranca.tipo]
                  const Icon = config.icon
                  return (
                    <TableRow key={lideranca.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full ${config.className} flex items-center justify-center`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{lideranca.nome}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{lideranca.bairro}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={config.className}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {lideranca.bairro}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {lideranca.influenciaEstimada}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {lideranca.telefone}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLideranca(lideranca)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedLideranca} onOpenChange={() => setSelectedLideranca(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Lideranca</DialogTitle>
            <DialogDescription>Informacoes completas</DialogDescription>
          </DialogHeader>
          {selectedLideranca && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {(() => {
                  const config = tipoConfig[selectedLideranca.tipo]
                  const Icon = config.icon
                  return (
                    <>
                      <div className={`h-12 w-12 rounded-full ${config.className} flex items-center justify-center`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{selectedLideranca.nome}</p>
                        <Badge className={config.className}>{config.label}</Badge>
                      </div>
                    </>
                  )
                })()}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{selectedLideranca.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedLideranca.bairro}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{selectedLideranca.influenciaEstimada}</span>
                </div>
              </div>

              {selectedLideranca.anotacoes && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Anotacoes do Gabinete</p>
                  <p className="text-sm">{selectedLideranca.anotacoes}</p>
                </div>
              )}

              <Button className="w-full" variant="outline" onClick={() => setSelectedLideranca(null)}>
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
