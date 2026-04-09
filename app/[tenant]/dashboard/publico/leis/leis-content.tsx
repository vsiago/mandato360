"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scale, Plus, Pencil, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { createLegislativo, updateLegislativo, deleteLegislativo, toggleLegislativoVisibility } from "@/lib/actions/legislativo"
import { toast } from "sonner"

const STATUS_OPTIONS = [
  { value: "tramitando", label: "Tramitando", color: "#3B82F6" },
  { value: "aprovado", label: "Aprovado", color: "#10B981" },
  { value: "rejeitado", label: "Rejeitado", color: "#EF4444" },
  { value: "arquivado", label: "Arquivado", color: "#94A3B8" },
  { value: "pendente", label: "Pendente", color: "#F59E0B" },
  { value: "concluido", label: "Concluído", color: "#0D9F6E" },
]

interface LeisPageProps {
  tenantId: string
  initialData: any[]
}

export function LeisPageContent({ tenantId, initialData }: LeisPageProps) {
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ titulo: "", numero: "", descricao: "", status: "tramitando", data: "", visivelLanding: true })

  const filtered = items.filter(i =>
    i.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (i.numero || "").toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditingItem(null)
    setForm({ titulo: "", numero: "", descricao: "", status: "tramitando", data: new Date().toISOString().split("T")[0], visivelLanding: true })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      titulo: item.titulo,
      numero: item.numero || "",
      descricao: item.descricao || "",
      status: item.status,
      data: item.data ? new Date(item.data).toISOString().split("T")[0] : "",
      visivelLanding: item.visivelLanding ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.titulo || !form.data) { toast.error("Preencha título e data"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updateLegislativo(editingItem.id, { ...form, data: new Date(form.data) } as any)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? result.data : i))
          toast.success("Atualizado com sucesso!")
        } else { toast.error(result.error) }
      } else {
        const result = await createLegislativo({ tenantId, tipo: "projeto_lei", ...form, data: new Date(form.data) } as any)
        if (result.success) {
          setItems(prev => [result.data, ...prev])
          toast.success("Criado com sucesso!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este item?")) return
    const result = await deleteLegislativo(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluído com sucesso!")
    } else { toast.error(result.error) }
  }

  const handleToggleVisibility = async (id: string, current: boolean) => {
    const result = await toggleLegislativoVisibility(id, !current)
    if (result.success) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, visivelLanding: !current } : i))
    }
  }

  const getStatusBadge = (status: string) => {
    const s = STATUS_OPTIONS.find(o => o.value === status)
    if (!s) return null
    return (
      <Badge variant="outline" className="text-[10px] font-bold" style={{ backgroundColor: `${s.color}15`, color: s.color, borderColor: `${s.color}30` }}>
        {s.label}
      </Badge>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Scale className="h-6 w-6 text-violet-600" />
            Leis / Projetos de Lei
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Gerencie seus projetos legislativos</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título ou número..." className="pl-10 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Scale className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum projeto encontrado</p>
              <p className="text-sm">Clique em "Novo Projeto" para começar</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.numero && <span className="text-xs font-bold text-muted-foreground">{item.numero}</span>}
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{item.titulo}</p>
                {item.descricao && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.descricao}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{item.data ? new Date(item.data).toLocaleDateString("pt-BR") : ""}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => handleToggleVisibility(item.id, item.visivelLanding)} className="h-8 w-8">
                  {item.visivelLanding ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Projeto" : "Novo Projeto de Lei"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input value={form.titulo} onChange={(e) => setForm(prev => ({ ...prev, titulo: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input value={form.numero} onChange={(e) => setForm(prev => ({ ...prev, numero: e.target.value }))} placeholder="PL 001/2026" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))} className="rounded-xl" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input type="date" value={form.data} onChange={(e) => setForm(prev => ({ ...prev, data: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-sm font-medium">Visível na Landing Page</span>
              <Switch checked={form.visivelLanding} onCheckedChange={(v) => setForm(prev => ({ ...prev, visivelLanding: v }))} />
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
