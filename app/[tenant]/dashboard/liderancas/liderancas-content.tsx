"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Plus, Pencil, Trash2, Search, Phone, MapPin, Users, Church, Store, Building, UserCheck, MoreHorizontal, Mail, UserPlus, FileCheck } from "lucide-react"
import { createLideranca, updateLideranca, deleteLideranca } from "@/lib/actions/liderancas"
import { toast } from "sonner"

const tipoConfig: Record<string, { label: string; icon: any; className: string }> = {
  lider_comunitario: { label: "Líder Comunitário", icon: Crown, className: "bg-primary/10 text-primary" },
  religioso: { label: "Líder Religioso", icon: Church, className: "bg-purple-50 text-purple-700" },
  comerciante: { label: "Comerciante", icon: Store, className: "bg-amber-50 text-amber-700" },
  sindico: { label: "Síndico", icon: Building, className: "bg-blue-50 text-blue-700" },
  presidente_associacao: { label: "Pres. Associação", icon: UserCheck, className: "bg-emerald-50 text-emerald-700" },
  outro: { label: "Outro", icon: MoreHorizontal, className: "bg-gray-50 text-gray-600" },
}

export function LiderancasPageContent({ tenantId, initialData, bairros }: { tenantId: string; initialData: any[]; bairros: any[] }) {
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", bairroId: "", bairro: "", tipo: "lider_comunitario", influenciaEstimada: "", anotacoes: "" })

  const filtered = items.filter(i => {
    const matchSearch = i.nome.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filtroTipo === "todos" || i.tipo === filtroTipo
    return matchSearch && matchTipo
  })

  const openNew = () => {
    setEditingItem(null)
    setForm({ nome: "", telefone: "", email: "", bairroId: "", bairro: "", tipo: "lider_comunitario", influenciaEstimada: "", anotacoes: "" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      nome: item.nome, telefone: item.telefone || "", email: item.email || "",
      bairroId: item.bairroId || "", bairro: item.bairro || "",
      tipo: item.tipo, influenciaEstimada: item.influenciaEstimada || "", anotacoes: item.anotacoes || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome || !form.tipo) { toast.error("Preencha nome e tipo"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updateLideranca(editingItem.id, form as any)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...result.data } : i))
          toast.success("Liderança atualizada!")
        } else { toast.error(result.error) }
      } else {
        const result = await createLideranca({ tenantId, ...form } as any)
        if (result.success) {
          setItems(prev => [result.data, ...prev])
          toast.success("Liderança criada!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta liderança?")) return
    const result = await deleteLideranca(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluída!")
    }
  }

  // Stats
  const porTipo = Object.keys(tipoConfig).reduce((acc, tipo) => {
    acc[tipo] = items.filter(i => i.tipo === tipo).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Lideranças
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Pessoas influentes do município</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Nova Liderança
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mb-6">
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold text-foreground">{items.length}</p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Total</p>
          </CardContent>
        </Card>
        {Object.entries(tipoConfig).map(([key, config]) => {
          const Icon = config.icon
          return (
            <Card key={key} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-3 flex items-center gap-2">
                <div className={`h-7 w-7 rounded-lg ${config.className} flex items-center justify-center shrink-0`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{porTipo[key] || 0}</p>
                  <p className="text-[9px] text-muted-foreground truncate">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar liderança..." className="pl-10 rounded-xl" />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[200px] rounded-xl"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            {Object.entries(tipoConfig).map(([key, config]) => <SelectItem key={key} value={key}>{config.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Crown className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhuma liderança encontrada</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((item) => {
          const config = tipoConfig[item.tipo] || tipoConfig.outro
          const Icon = config.icon
          const leadsCount = item.leads?.length || 0
          const indicacoesCount = item.indicacoes?.length || 0
          return (
            <Card key={item.id} className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`h-11 w-11 rounded-full ${config.className} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedItem(item)}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.nome}</p>
                    <Badge className={`text-[10px] ${config.className}`}>{config.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {(item.bairroRef?.nome || item.bairro) && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.bairroRef?.nome || item.bairro}</span>
                    )}
                    {item.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.telefone}</span>}
                    {item.influenciaEstimada && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{item.influenciaEstimada}</span>}
                  </div>
                  <div className="flex gap-2 mt-1">
                    {leadsCount > 0 && <Badge variant="secondary" className="text-[10px] gap-1"><UserPlus className="h-3 w-3" />{leadsCount} leads</Badge>}
                    {indicacoesCount > 0 && <Badge variant="secondary" className="text-[10px] gap-1"><FileCheck className="h-3 w-3" />{indicacoesCount} indicações</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  {selectedItem.nome}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="info">
                <TabsList className="w-full">
                  <TabsTrigger value="info" className="flex-1">Dados</TabsTrigger>
                  <TabsTrigger value="leads" className="flex-1">Leads ({selectedItem.leads?.length || 0})</TabsTrigger>
                  <TabsTrigger value="indicacoes" className="flex-1">Indicações ({selectedItem.indicacoes?.length || 0})</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {selectedItem.telefone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{selectedItem.telefone}</div>}
                    {selectedItem.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{selectedItem.email}</div>}
                    {(selectedItem.bairroRef?.nome || selectedItem.bairro) && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{selectedItem.bairroRef?.nome || selectedItem.bairro}</div>}
                    {selectedItem.influenciaEstimada && <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" />{selectedItem.influenciaEstimada}</div>}
                  </div>
                  {selectedItem.anotacoes && (
                    <div className="p-3 rounded-xl bg-muted/50">
                      <p className="text-xs font-bold text-muted-foreground mb-1">Anotações</p>
                      <p className="text-sm">{selectedItem.anotacoes}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="leads" className="mt-4">
                  {(selectedItem.leads || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Nenhum lead vinculado</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {(selectedItem.leads || []).map((l: any) => (
                        <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 uppercase">{l.nome?.[0]}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{l.nome}</p>
                            <p className="text-xs text-muted-foreground">{l.telefone || l.email || "Sem contato"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="indicacoes" className="mt-4">
                  {(selectedItem.indicacoes || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Nenhuma indicação vinculada</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {(selectedItem.indicacoes || []).map((ind: any) => (
                        <div key={ind.id} className="p-3 rounded-xl bg-muted/50">
                          <p className="text-sm font-medium">{ind.descricao}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px]">{ind.status}</Badge>
                            {ind.tipo && <Badge variant="secondary" className="text-[10px]">{ind.tipo}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editingItem ? "Editar Liderança" : "Nova Liderança"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(e) => setForm(prev => ({ ...prev, telefone: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Select value={form.bairroId} onValueChange={(v) => setForm(prev => ({ ...prev, bairroId: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {bairros.map(b => <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm(prev => ({ ...prev, tipo: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoConfig).map(([key, config]) => <SelectItem key={key} value={key}>{config.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Influência Estimada</Label>
              <Input value={form.influenciaEstimada} onChange={(e) => setForm(prev => ({ ...prev, influenciaEstimada: e.target.value }))} placeholder="Ex: 200 famílias" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Anotações</Label>
              <Textarea value={form.anotacoes} onChange={(e) => setForm(prev => ({ ...prev, anotacoes: e.target.value }))} className="rounded-xl" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl">{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
