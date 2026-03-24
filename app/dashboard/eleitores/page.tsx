"use client"

import { useState } from "react"
import { Eye, Pencil, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { eleitores, demandas } from "@/lib/mock-data"
import type { Eleitor } from "@/lib/mock-data"

export default function EleitoresPage() {
  const [search, setSearch] = useState("")
  const [selectedEleitor, setSelectedEleitor] = useState<Eleitor | null>(null)
  const [editingEleitor, setEditingEleitor] = useState<Eleitor | null>(null)

  const filteredEleitores = eleitores.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.bairro.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  )

  const getEleitorDemandas = (eleitorId: string) => {
    return demandas.filter((d) => d.eleitorId === eleitorId)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Eleitores</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Gerencie os eleitores cadastrados
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base md:text-lg font-semibold">Lista de Eleitores</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eleitores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-muted"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Bairro</TableHead>
                  <TableHead className="hidden xl:table-cell">Data Cadastro</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Solicitacoes</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEleitores.map((eleitor) => (
                  <TableRow key={eleitor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{eleitor.nome}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{eleitor.bairro}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{eleitor.telefone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{eleitor.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{eleitor.bairro}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {new Date(eleitor.dataCadastro).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">{eleitor.totalSolicitacoes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 md:h-9 md:w-9"
                          onClick={() => setSelectedEleitor(eleitor)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 md:h-9 md:w-9"
                          onClick={() => setEditingEleitor(eleitor)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedEleitor} onOpenChange={() => setSelectedEleitor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Eleitor</DialogTitle>
            <DialogDescription>Informacoes e historico de solicitacoes</DialogDescription>
          </DialogHeader>
          {selectedEleitor && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-foreground">{selectedEleitor.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-foreground">{selectedEleitor.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedEleitor.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bairro</p>
                  <p className="text-foreground">{selectedEleitor.bairro}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                  <p className="text-foreground">
                    {new Date(selectedEleitor.dataCadastro).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Solicitações</p>
                  <p className="text-foreground">{selectedEleitor.totalSolicitacoes}</p>
                </div>
              </div>

              {selectedEleitor.observacoes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observações</p>
                  <p className="text-foreground">{selectedEleitor.observacoes}</p>
                </div>
              )}

              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Historico de Solicitacoes</p>
                <div className="space-y-2">
                  {getEleitorDemandas(selectedEleitor.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma solicitacao registrada.</p>
                  ) : (
                    getEleitorDemandas(selectedEleitor.id).map((demanda) => (
                      <div
                        key={demanda.id}
                        className="rounded-xl bg-muted/50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{demanda.tipo}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(demanda.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{demanda.descricao}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={!!editingEleitor} onOpenChange={() => setEditingEleitor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Eleitor</DialogTitle>
            <DialogDescription>Atualize as informacoes do eleitor</DialogDescription>
          </DialogHeader>
          {editingEleitor && (
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <Input defaultValue={editingEleitor.nome} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <Input defaultValue={editingEleitor.telefone} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input defaultValue={editingEleitor.email} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <Input defaultValue={editingEleitor.bairro} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Observações</label>
                <Input defaultValue={editingEleitor.observacoes || ""} className="mt-1" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setEditingEleitor(null)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setEditingEleitor(null)}>
                  Salvar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
