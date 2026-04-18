"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Phone, MapPin, Users, Mail, Eye, Pencil, Trash2, UserPlus, Calendar, Plus } from "lucide-react"
import { createEleitor, updateEleitor } from "@/lib/actions/eleitores"
import { toast } from "sonner"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  apoiador: { label: "Apoiador Principal", color: "bg-emerald-100 text-emerald-700", icon: Users },
  simpatizante: { label: "Simpatizante", color: "bg-blue-100 text-blue-700", icon: UserPlus },
  neutro: { label: "Neutro", color: "bg-stone-100 text-stone-700", icon: Users },
  problema: { label: "Desconectado", color: "bg-amber-100 text-amber-700", icon: Eye },
}

export function EleitoresPageContent({ tenantId, tenantSlug, initialData, bairros }: { tenantId: string; tenantSlug: string; initialData: any[]; bairros: any[] }) {
  const [eleitores, setEleitores] = useState(initialData)
  const [search, setSearch] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [bairroFiltro, setBairroFiltro] = useState("todos")
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingEleitor, setEditingEleitor] = useState<any>(null)
  const [selectedEleitor, setSelectedEleitor] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", bairro: "", bairroId: "", observacoes: "" })

  const filtered = eleitores.filter(e => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) || 
                        e.telefone?.includes(search) || 
                        e.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filtroStatus === "todos" || e.statusRelacionamento === filtroStatus
    // Using simple text match for bairro, since we stored text in legacy
    const matchBairro = bairroFiltro === "todos" || e.bairro === bairroFiltro
    return matchSearch && matchStatus && matchBairro
  })

  // Unique bairros map from the actual eleitores records to simplify the filter dropdown, 
  // as old eleitores didn't have strict IDs mapped
  const uniqueBairros = Array.from(new Set(eleitores.map(e => e.bairro).filter(Boolean)))

  const openNew = () => {
    setEditingEleitor(null)
    setForm({ nome: "", telefone: "", email: "", bairro: "", bairroId: "", observacoes: "" })
    setIsDrawerOpen(true)
  }

  const openEdit = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    setEditingEleitor(item)
    // Try to guess the bairroId based on the strict bairros list
    const foundBairro = bairros.find(b => b.nome === item.bairro)
    setForm({
      nome: item.nome, 
      telefone: item.telefone || "", 
      email: item.email || "",
      bairro: item.bairro || "", 
      bairroId: foundBairro ? foundBairro.id : "",
      observacoes: item.observacoes || "",
    })
    setIsDrawerOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome) { toast.error("O campo Nome é obrigatório"); return }
    
    setSaving(true)
    try {
      const selectedBairro = bairros.find(b => b.id === form.bairroId)
      const payload = {
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        bairroId: form.bairroId || undefined,
        bairro: selectedBairro ? selectedBairro.nome : form.bairro, // fallback
        observacoes: form.observacoes,
      }

      if (editingEleitor) {
        const result = await updateEleitor(editingEleitor.id, payload)
        if (result.success) {
          // Re-fetch or manually apply changes to state wrapper
          setEleitores(prev => prev.map(i => i.id === editingEleitor.id ? { ...i, ...payload, statusRelacionamento: i.statusRelacionamento } : i))
          toast.success("Eleitor atualizado!")
          setIsDrawerOpen(false)
        } else { toast.error(result.error) }
      } else {
        const result = await createEleitor(tenantSlug, payload)
        if (result.success) {
          // Manually append a rough matching object, normally you'd re-fetch
          const newEleitor = {
             id: result.data?.id || Math.random().toString(),
             ...payload,
             statusRelacionamento: "neutro",
             dataCadastro: new Date().toISOString(),
             totalSolicitacoes: 0,
             demandas: []
          }
          setEleitores(prev => [newEleitor, ...prev])
          toast.success("Eleitor cadastrado com sucesso!")
          setIsDrawerOpen(false)
        } else { toast.error(result.error) }
      }
    } finally { setSaving(false) }
  }

  const porStatus = Object.keys(statusConfig).reduce((acc, status) => {
    acc[status] = eleitores.filter(i => i.statusRelacionamento === status).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            Eleitores
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Conexão direta com a população</p>
        </div>
        <Button onClick={openNew} className="rounded-xl h-9 text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Novo Eleitor
        </Button>
      </div>

      {/* Stats Cards Lideranças Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
        <Card className="rounded-2xl border border-border/60 shadow-sm bg-card transition-all duration-200">
          <CardContent className="p-3 text-center flex flex-col justify-center h-full">
            <p className="text-xl font-bold text-foreground">{eleitores.length}</p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total Contatos</p>
          </CardContent>
        </Card>
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon
          return (
            <Card key={key} className="rounded-2xl border border-border/60 shadow-sm bg-card transition-all duration-200 h-full">
              <CardContent className="p-3 flex items-center gap-2 h-full">
                <div className={`h-8 w-8 rounded-lg ${config.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{porStatus[key] || 0}</p>
                  <p className="text-[9px] text-muted-foreground truncate max-w-[80px]">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Buscar por nome ou contato..." 
            className="pl-9 rounded-xl h-10 border-border/60" 
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-1/2 sm:w-[150px] rounded-xl h-10 border-border/60">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="todos">Todos Status</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => 
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                )}
            </SelectContent>
            </Select>

            <Select value={bairroFiltro} onValueChange={setBairroFiltro}>
            <SelectTrigger className="w-1/2 sm:w-[150px] rounded-xl h-10 border-border/60">
                <SelectValue placeholder="Bairros" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="todos">Todos Bairros</SelectItem>
                {uniqueBairros.map(b => 
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                )}
            </SelectContent>
            </Select>
        </div>
      </div>

      {/* Cards List (Replaces old table) */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum eleitor encontrado</p>
            </CardContent>
          </Card>
        )}
        
        {filtered.map((item) => {
          const sConf = statusConfig[item.statusRelacionamento] || statusConfig.neutro
          const Icon = sConf.icon
          return (
            <Card key={item.id} className="rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-full ${sConf.color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedEleitor(item)}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.nome}</p>
                    <Badge className={`text-[10px] ${sConf.color}`}>{sConf.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {item.bairro && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.bairro}</span>
                    )}
                    {item.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.telefone}</span>}
                  </div>
                  <div className="flex gap-2 mt-1">
                    {item.totalSolicitacoes > 0 && <Badge variant="secondary" className="text-[10px] gap-1"><Calendar className="h-3 w-3" />{item.totalSolicitacoes} registros</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={(e) => openEdit(e, item)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors active:scale-95"><Pencil className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Drawer para Tela de Detalhes Eleitor */}
      <Drawer open={!!selectedEleitor} onOpenChange={(open) => !open && setSelectedEleitor(null)}>
        <DrawerContent className="bg-stone-50 border-t border-stone-200 h-[85vh]">
          {selectedEleitor && (
            <div className="mx-auto w-full max-w-lg h-full flex flex-col">
              <DrawerHeader className="text-left border-b border-stone-200 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-blue-700 font-bold text-xl">{selectedEleitor.nome.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <DrawerTitle className="text-xl font-bold text-stone-800">{selectedEleitor.nome}</DrawerTitle>
                        <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                           <MapPin className="h-3.5 w-3.5" /> {selectedEleitor.bairro || 'Sem Bairro'}
                        </p>
                    </div>
                </div>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
                        <p className="text-xs text-stone-500 mb-0.5">Contato</p>
                        <p className="text-sm font-semibold text-stone-800">{selectedEleitor.telefone || '-'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
                        <p className="text-xs text-stone-500 mb-0.5">Total Registros</p>
                        <p className="text-sm font-semibold text-stone-800">{selectedEleitor.totalSolicitacoes} tickets</p>
                    </div>
                </div>

                {selectedEleitor.observacoes && (
                    <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Observações</p>
                        <p className="text-sm text-stone-700">{selectedEleitor.observacoes}</p>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-bold text-stone-800">Histórico de Demandas</h4>
                    
                    {!selectedEleitor.demandas || selectedEleitor.demandas.length === 0 ? (
                        <div className="text-center py-6 border border-dashed border-stone-200 rounded-2xl text-stone-400">
                            Nenhum registro no histórico.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedEleitor.demandas.map((demanda: any) => (
                                <div key={demanda.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge className="bg-stone-100 text-stone-700 hover:bg-stone-200 border-0">{demanda.tipo}</Badge>
                                        <span className="text-[10px] text-stone-400 font-medium">
                                            {new Date(demanda.data).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-stone-600 line-clamp-3">{demanda.descricao}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Drawer Create / Edit Eleitor */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-stone-50 border-t border-stone-200 h-[85vh]">
          <div className="mx-auto w-full max-w-lg h-full flex flex-col">
            <DrawerHeader className="text-left border-b border-stone-200 pb-4 shrink-0">
              <DrawerTitle className="text-xl font-bold text-stone-800">
                {editingEleitor ? "Editar Eleitor" : "Novo Eleitor"}
              </DrawerTitle>
              <DrawerDescription className="text-stone-500">
                Informações para cadastro rápido de base.
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nome" className="text-stone-700">Nome do Eleitor *</Label>
                        <Input 
                            id="nome"
                            required 
                            className="rounded-xl h-11 border-stone-200 bg-white"
                            value={form.nome}
                            onChange={e => setForm({...form, nome: e.target.value})}
                            placeholder="Ex: Carlos Silva"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefone" className="text-stone-700">Telefone</Label>
                            <Input 
                                id="telefone"
                                className="rounded-xl h-11 border-stone-200 bg-white"
                                value={form.telefone}
                                onChange={e => setForm({...form, telefone: e.target.value})}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bairroId" className="text-stone-700">Bairro</Label>
                            <Select 
                                value={form.bairroId}
                                onValueChange={v => setForm({...form, bairroId: v})}
                            >
                                <SelectTrigger id="bairroId" className="rounded-xl h-11 border-stone-200 bg-white">
                                <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl max-h-[200px]">
                                {bairros.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-stone-700">E-mail (Opcional)</Label>
                        <Input 
                            id="email"
                            type="email"
                            className="rounded-xl h-11 border-stone-200 bg-white"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="carlos@exemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observacoes" className="text-stone-700">Anotações Relevantes</Label>
                        <Textarea 
                            id="observacoes" 
                            rows={4}
                            className="rounded-xl border-stone-200 bg-white resize-none"
                            value={form.observacoes}
                            onChange={e => setForm({...form, observacoes: e.target.value})}
                            placeholder="Ex: Família tradicional, trabalha no comércio..."
                        />
                    </div>
                </div>

                <DrawerFooter className="px-4 py-4 bg-white border-t border-stone-200 shrink-0 flex-row gap-3">
                    <DrawerClose asChild>
                        <Button type="button" variant="outline" className="rounded-xl h-12 flex-1">
                            Cancelar
                        </Button>
                    </DrawerClose>
                    <Button type="submit" disabled={saving} className="rounded-xl h-12 flex-1">
                        {saving ? "Salvando..." : "Salvar Eleitor"}
                    </Button>
                </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
