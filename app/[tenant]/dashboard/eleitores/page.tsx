"use client"

import { useState, useEffect } from "react"
import { Eye, Pencil, Search, Loader2, Users } from "lucide-react"
import { useParams } from "next/navigation"
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
import { getEleitoresByTenant, updateEleitor } from "@/lib/actions/eleitores"
import { toast } from "sonner"

interface Eleitor {
  id: string
  nome: string
  email: string
  telefone: string
  bairro: string
  dataCadastro: string
  totalSolicitacoes: number
  statusRelacionamento: string
  observacoes: string
  demandas?: any[]
}

export default function EleitoresPage() {
  const params = useParams()
  const tenantSlug = params.tenant as string
  
  const [eleitores, setEleitores] = useState<Eleitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedEleitor, setSelectedEleitor] = useState<Eleitor | null>(null)
  const [editingEleitor, setEditingEleitor] = useState<Eleitor | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchEleitores = async () => {
    setIsLoading(true)
    const data = await getEleitoresByTenant(tenantSlug)
    setEleitores(data as any)
    setIsLoading(false)
  }

  useEffect(() => {
    if (tenantSlug) {
      fetchEleitores()
    }
  }, [tenantSlug])

  const filteredEleitores = eleitores.filter(
    (e) =>
      e.nome.toLowerCase().includes(search.toLowerCase()) ||
      e.bairro.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingEleitor) return
    
    setIsUpdating(true)
    const formData = new FormData(e.currentTarget)
    const updatedData = {
      nome: formData.get("nome") as string,
      telefone: formData.get("telefone") as string,
      email: formData.get("email") as string,
      bairro: formData.get("bairro") as string,
      observacoes: formData.get("observacoes") as string,
    }

    const res = await updateEleitor(editingEleitor.id, updatedData)
    if (res.success) {
      toast.success("Eleitor atualizado com sucesso!")
      setEditingEleitor(null)
      fetchEleitores()
    } else {
      toast.error(res.error || "Erro ao atualizar")
    }
    setIsUpdating(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            Eleitores
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Gerencie os eleitores cadastrados
          </p>
        </div>
      </div>

      <Card className="rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 bg-muted/20 border-b border-border/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-[14px] font-semibold">Lista de Eleitores</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar eleitores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-border/60 h-9 text-[13px] transition-all hover:border-border focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex py-20 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
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
                  {filteredEleitores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        Nenhum eleitor encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEleitores.map((eleitor) => (
                      <TableRow key={eleitor.id} className="hover:bg-muted/40 transition-colors group">
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
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-600 transition-colors active:scale-95"
                              onClick={() => setSelectedEleitor(eleitor)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Visualizar</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors active:scale-95"
                              onClick={() => setEditingEleitor(eleitor)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Visualização */}
      <Dialog open={!!selectedEleitor} onOpenChange={() => setSelectedEleitor(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border-border/60">
          <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
            <DialogTitle className="text-lg">Detalhes do Eleitor</DialogTitle>
            <DialogDescription className="text-xs">Informações e historico de solicitacoes</DialogDescription>
          </DialogHeader>
          {selectedEleitor && (
            <div className="space-y-6 p-6">
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
                  {!selectedEleitor.demandas || selectedEleitor.demandas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma solicitacao registrada.</p>
                  ) : (
                    selectedEleitor.demandas.map((demanda) => (
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
        <DialogContent className="rounded-2xl p-0 overflow-hidden border-border/60">
          <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
            <DialogTitle className="text-lg">Editar Eleitor</DialogTitle>
            <DialogDescription className="text-xs">Atualize as informacoes do eleitor</DialogDescription>
          </DialogHeader>
          {editingEleitor && (
            <form onSubmit={handleUpdate} className="space-y-4 p-6 pt-2">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <Input name="nome" defaultValue={editingEleitor.nome} className="mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <Input name="telefone" defaultValue={editingEleitor.telefone} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input name="email" defaultValue={editingEleitor.email} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <Input name="bairro" defaultValue={editingEleitor.bairro} className="mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Observações</label>
                <Input name="observacoes" defaultValue={editingEleitor.observacoes || ""} className="mt-1" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setEditingEleitor(null)} disabled={isUpdating}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
