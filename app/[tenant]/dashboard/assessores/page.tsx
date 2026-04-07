"use client"

import { useState } from "react"
import { Plus, Eye, Search, Trophy, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { assessores as initialAssessores, demandas, bairros } from "@/lib/mock-data"
import type { Assessor } from "@/lib/mock-data"

export default function AssessoresPage() {
  const [assessores, setAssessores] = useState<Assessor[]>(initialAssessores)
  const [search, setSearch] = useState("")
  const [selectedAssessor, setSelectedAssessor] = useState<Assessor | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newAssessor, setNewAssessor] = useState({
    nome: "",
    cargo: "",
    telefone: "",
    email: "",
    bairroAtuacao: "",
    status: "ativo" as "ativo" | "inativo",
  })

  const filteredAssessores = assessores.filter(
    (a) =>
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.cargo.toLowerCase().includes(search.toLowerCase()) ||
      a.bairroAtuacao.toLowerCase().includes(search.toLowerCase())
  )

  // Ranking dos assessores por demandas resolvidas
  const ranking = [...assessores]
    .filter(a => a.status === 'ativo')
    .sort((a, b) => b.demandasResolvidas - a.demandasResolvidas)
    .slice(0, 5)

  // Estatisticas
  const totalAtivos = assessores.filter(a => a.status === 'ativo').length
  const totalDemandas = assessores.reduce((acc, a) => acc + a.demandasResolvidas + a.demandasEmAndamento, 0)
  const totalResolvidas = assessores.reduce((acc, a) => acc + a.demandasResolvidas, 0)

  const handleAddAssessor = () => {
    const newId = (assessores.length + 1).toString()
    const assessor: Assessor = {
      id: newId,
      ...newAssessor,
      demandasResolvidas: 0,
      demandasEmAndamento: 0,
      dataCadastro: new Date().toISOString().split('T')[0],
    }
    setAssessores([...assessores, assessor])
    setNewAssessor({
      nome: "",
      cargo: "",
      telefone: "",
      email: "",
      bairroAtuacao: "",
      status: "ativo",
    })
    setIsAddDialogOpen(false)
  }

  // Demandas simuladas atribuidas ao assessor
  const getAssessorDemandas = (assessorId: string) => {
    // Simula distribuicao de demandas entre assessores
    const index = parseInt(assessorId) - 1
    return demandas.filter((_, i) => i % assessores.length === index)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Assessores</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gerencie a equipe do gabinete
        </p>
      </div>

      {/* Estatisticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalAtivos}</p>
                <p className="text-xs text-muted-foreground">Assessores Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalResolvidas}</p>
                <p className="text-xs text-muted-foreground">Demandas Resolvidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalDemandas - totalResolvidas}</p>
                <p className="text-xs text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{ranking[0]?.nome.split(' ')[0] || '-'}</p>
                <p className="text-xs text-muted-foreground">Mais Produtivo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista de Assessores */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-base md:text-lg font-semibold">Equipe do Gabinete</CardTitle>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 rounded-xl border-muted"
                    />
                  </div>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="shrink-0">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Assessor</DialogTitle>
                        <DialogDescription>Adicione um novo membro a equipe do gabinete</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => { e.preventDefault(); handleAddAssessor(); }} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground">Nome</label>
                          <Input
                            value={newAssessor.nome}
                            onChange={(e) => setNewAssessor({ ...newAssessor, nome: e.target.value })}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground">Cargo</label>
                          <Input
                            value={newAssessor.cargo}
                            onChange={(e) => setNewAssessor({ ...newAssessor, cargo: e.target.value })}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Telefone</label>
                            <Input
                              value={newAssessor.telefone}
                              onChange={(e) => setNewAssessor({ ...newAssessor, telefone: e.target.value })}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Email</label>
                            <Input
                              type="email"
                              value={newAssessor.email}
                              onChange={(e) => setNewAssessor({ ...newAssessor, email: e.target.value })}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Bairro de Atuacao</label>
                            <Select
                              value={newAssessor.bairroAtuacao}
                              onValueChange={(value) => setNewAssessor({ ...newAssessor, bairroAtuacao: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {bairros.map((b) => (
                                  <SelectItem key={b} value={b}>{b}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Status</label>
                            <Select
                              value={newAssessor.status}
                              onValueChange={(value: "ativo" | "inativo") => setNewAssessor({ ...newAssessor, status: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ativo">Ativo</SelectItem>
                                <SelectItem value="inativo">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Adicionar</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden sm:table-cell">Cargo</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="text-center">Resolvidas</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">Andamento</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessores.map((assessor) => (
                      <TableRow key={assessor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assessor.nome}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{assessor.cargo}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{assessor.cargo}</TableCell>
                        <TableCell className="hidden md:table-cell">{assessor.telefone}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-emerald-600">{assessor.demandasResolvidas}</span>
                        </TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          <span className="font-semibold text-amber-600">{assessor.demandasEmAndamento}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={assessor.status === 'ativo' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' : 'bg-muted text-muted-foreground'}>
                            {assessor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedAssessor(assessor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking de Assessores */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Ranking de Produtividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ranking.map((assessor, index) => (
                  <div key={assessor.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{assessor.nome}</p>
                      <p className="text-xs text-muted-foreground">{assessor.cargo}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{assessor.demandasResolvidas}</p>
                      <p className="text-xs text-muted-foreground">resolvidas</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Perfil do Assessor */}
      <Dialog open={!!selectedAssessor} onOpenChange={() => setSelectedAssessor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil do Assessor</DialogTitle>
            <DialogDescription>Informacoes e demandas atribuidas</DialogDescription>
          </DialogHeader>
          {selectedAssessor && (
            <div className="space-y-6">
              {/* Informacoes do Assessor */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-foreground">{selectedAssessor.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                  <p className="text-foreground">{selectedAssessor.cargo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-foreground">{selectedAssessor.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedAssessor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bairro de Atuacao</p>
                  <p className="text-foreground">{selectedAssessor.bairroAtuacao}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={selectedAssessor.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-muted text-muted-foreground'}>
                    {selectedAssessor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              {/* Estatisticas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-700">{selectedAssessor.demandasResolvidas}</p>
                  <p className="text-xs text-emerald-600">Resolvidas</p>
                </div>
                <div className="rounded-xl bg-amber-50 p-4 text-center">
                  <p className="text-2xl font-bold text-amber-700">{selectedAssessor.demandasEmAndamento}</p>
                  <p className="text-xs text-amber-600">Em Andamento</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{selectedAssessor.demandasResolvidas + selectedAssessor.demandasEmAndamento}</p>
                  <p className="text-xs text-primary">Total</p>
                </div>
              </div>

              {/* Demandas Atribuidas */}
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Demandas Atribuidas</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getAssessorDemandas(selectedAssessor.id).map((demanda) => (
                    <div key={demanda.id} className="rounded-xl bg-muted/50 p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground">{demanda.tipo}</p>
                        <Badge className={
                          demanda.status === 'resolvido' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50' :
                          demanda.status === 'analise' ? 'bg-amber-50 text-amber-700 hover:bg-amber-50' :
                          demanda.status === 'encaminhado' ? 'bg-accent/10 text-accent hover:bg-accent/10' :
                          'bg-primary/10 text-primary hover:bg-primary/10'
                        }>
                          {demanda.status === 'novo' ? 'Nova' : 
                           demanda.status === 'analise' ? 'Em Analise' :
                           demanda.status === 'encaminhado' ? 'Encaminhada' : 'Resolvida'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{demanda.bairro} - {demanda.eleitorNome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
