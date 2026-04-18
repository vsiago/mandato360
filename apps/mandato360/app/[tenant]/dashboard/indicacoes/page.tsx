"use client"

import { useState } from "react"
import { Plus, FileCheck, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { indicacoes as initialIndicacoes, bairros } from "@/lib/mock-data"
import type { Indicacao } from "@/lib/mock-data"

const statusConfig = {
  pendente: { label: 'Pendente', className: 'bg-amber-50 text-amber-700' },
  aprovada: { label: 'Aprovada', className: 'bg-primary/10 text-primary' },
  em_execucao: { label: 'Em Execucao', className: 'bg-accent/10 text-accent' },
  concluida: { label: 'Concluida', className: 'bg-emerald-50 text-emerald-700' },
}

export default function IndicacoesPage() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>(initialIndicacoes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newIndicacao, setNewIndicacao] = useState({
    titulo: '',
    bairro: '',
    status: 'pendente' as Indicacao['status'],
  })

  const handleAddIndicacao = () => {
    const indicacao: Indicacao = {
      id: String(indicacoes.length + 1),
      ...newIndicacao,
      data: new Date().toISOString().split('T')[0],
    }
    setIndicacoes([indicacao, ...indicacoes])
    setNewIndicacao({ titulo: '', bairro: '', status: 'pendente' })
    setIsAddDialogOpen(false)
  }

  const handleStatusChange = (indicacaoId: string, newStatus: Indicacao['status']) => {
    setIndicacoes(indicacoes.map(i => 
      i.id === indicacaoId ? { ...i, status: newStatus } : i
    ))
  }

  // Estatisticas
  const totalIndicacoes = indicacoes.length
  const concluidas = indicacoes.filter(i => i.status === 'concluida').length
  const emExecucao = indicacoes.filter(i => i.status === 'em_execucao').length

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Indicacoes</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Acompanhe as indicacoes feitas ao executivo
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Indicacao
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Indicacao</DialogTitle>
              <DialogDescription>Preencha as informacoes da indicacao</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddIndicacao()
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground">Titulo</label>
                <Input
                  value={newIndicacao.titulo}
                  onChange={(e) => setNewIndicacao({ ...newIndicacao, titulo: e.target.value })}
                  placeholder="Titulo da indicacao"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <Select
                  value={newIndicacao.bairro}
                  onValueChange={(value) => setNewIndicacao({ ...newIndicacao, bairro: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {bairros.map((bairro) => (
                      <SelectItem key={bairro} value={bairro}>
                        {bairro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select
                  value={newIndicacao.status}
                  onValueChange={(value) => setNewIndicacao({ ...newIndicacao, status: value as Indicacao['status'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="em_execucao">Em Execucao</SelectItem>
                    <SelectItem value="concluida">Concluida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatisticas */}
      <div className="mb-6 md:mb-8 grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileCheck className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{totalIndicacoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-purple-100">
                <FileCheck className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Execucao</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{emExecucao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg bg-emerald-100">
                <FileCheck className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Concluidas</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">{concluidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Lista de Indicacoes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indicacoes.map((indicacao) => (
                  <TableRow key={indicacao.id}>
                    <TableCell className="font-medium">{indicacao.titulo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {indicacao.bairro}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(indicacao.data).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={indicacao.status}
                        onValueChange={(value) => handleStatusChange(indicacao.id, value as Indicacao['status'])}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <Badge className={statusConfig[indicacao.status].className}>
                            {statusConfig[indicacao.status].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">
                            <Badge className={statusConfig.pendente.className}>Pendente</Badge>
                          </SelectItem>
                          <SelectItem value="aprovada">
                            <Badge className={statusConfig.aprovada.className}>Aprovada</Badge>
                          </SelectItem>
                          <SelectItem value="em_execucao">
                            <Badge className={statusConfig.em_execucao.className}>Em Execucao</Badge>
                          </SelectItem>
                          <SelectItem value="concluida">
                            <Badge className={statusConfig.concluida.className}>Concluida</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
