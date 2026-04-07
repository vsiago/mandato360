"use client"

import { useState } from "react"
import { Plus, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { projetosLei as initialProjetosLei } from "@/lib/mock-data"
import type { ProjetoLei } from "@/lib/mock-data"

const statusConfig = {
  tramitando: { label: 'Tramitando', className: 'bg-amber-100 text-amber-700' },
  aprovado: { label: 'Aprovado', className: 'bg-emerald-100 text-emerald-700' },
  rejeitado: { label: 'Rejeitado', className: 'bg-red-100 text-red-700' },
  arquivado: { label: 'Arquivado', className: 'bg-muted text-muted-foreground' },
}

export default function ProjetosLeiPage() {
  const [projetosLei, setProjetosLei] = useState<ProjetoLei[]>(initialProjetosLei)
  const [selectedProjeto, setSelectedProjeto] = useState<ProjetoLei | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProjeto, setNewProjeto] = useState({
    titulo: '',
    numero: '',
    descricao: '',
    status: 'tramitando' as ProjetoLei['status'],
  })

  const handleAddProjeto = () => {
    const projeto: ProjetoLei = {
      id: String(projetosLei.length + 1),
      ...newProjeto,
      data: new Date().toISOString().split('T')[0],
    }
    setProjetosLei([projeto, ...projetosLei])
    setNewProjeto({ titulo: '', numero: '', descricao: '', status: 'tramitando' })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Projetos de Lei</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie os projetos de lei do mandato
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Projeto de Lei</DialogTitle>
              <DialogDescription>Preencha as informacoes do projeto</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddProjeto()
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground">Titulo</label>
                <Input
                  value={newProjeto.titulo}
                  onChange={(e) => setNewProjeto({ ...newProjeto, titulo: e.target.value })}
                  placeholder="Titulo do projeto"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Numero do Projeto</label>
                <Input
                  value={newProjeto.numero}
                  onChange={(e) => setNewProjeto({ ...newProjeto, numero: e.target.value })}
                  placeholder="Ex: PL 001/2024"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Status</label>
                <Select
                  value={newProjeto.status}
                  onValueChange={(value) => setNewProjeto({ ...newProjeto, status: value as ProjetoLei['status'] })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tramitando">Tramitando</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Descricao</label>
                <Textarea
                  value={newProjeto.descricao}
                  onChange={(e) => setNewProjeto({ ...newProjeto, descricao: e.target.value })}
                  placeholder="Descricao do projeto de lei"
                  className="mt-1"
                  rows={4}
                  required
                />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="h-5 w-5 text-primary" />
            Lista de Projetos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titulo</TableHead>
                  <TableHead className="hidden sm:table-cell">Numero</TableHead>
                  <TableHead className="hidden md:table-cell">Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Descricao</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projetosLei.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{projeto.titulo}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{projeto.numero}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{projeto.numero}</TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(projeto.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[projeto.status].className}>
                        {statusConfig[projeto.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate xl:table-cell">
                      {projeto.descricao}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:h-9 md:w-9"
                        onClick={() => setSelectedProjeto(projeto)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedProjeto} onOpenChange={() => setSelectedProjeto(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Projeto de Lei</DialogTitle>
            <DialogDescription>Informacoes completas do projeto</DialogDescription>
          </DialogHeader>
          {selectedProjeto && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={statusConfig[selectedProjeto.status].className}>
                  {statusConfig[selectedProjeto.status].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Titulo</p>
                <p className="text-foreground">{selectedProjeto.titulo}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Numero</p>
                  <p className="text-foreground">{selectedProjeto.numero}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="text-foreground">
                    {new Date(selectedProjeto.data).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descricao</p>
                <div className="mt-1 rounded-lg bg-muted p-3">
                  <p className="text-foreground">{selectedProjeto.descricao}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
