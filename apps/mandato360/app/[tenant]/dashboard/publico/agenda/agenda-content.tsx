"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react"
import { createAgenda, updateAgenda, deleteAgenda } from "@/lib/actions/agenda"
import { toast } from "sonner"

const TIPO_OPTIONS = [
  { value: "visita", label: "Visita" },
  { value: "acao", label: "Ação" },
  { value: "audiencia", label: "Audiência" },
  { value: "reuniao", label: "Reunião" },
  { value: "evento", label: "Evento" },
  { value: "outro", label: "Outro" },
]

export function AgendaPageContent({ tenantId, initialData }: { tenantId: string; initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ titulo: "", descricao: "", local: "", dataEvento: "", tipo: "evento", visivel: true })

  const openNew = () => {
    setEditingItem(null)
    setForm({ titulo: "", descricao: "", local: "", dataEvento: "", tipo: "evento", visivel: true })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      titulo: item.titulo,
      descricao: item.descricao || "",
      local: item.local || "",
      dataEvento: item.dataEvento ? new Date(item.dataEvento).toISOString().slice(0, 16) : "",
      tipo: item.tipo || "evento",
      visivel: item.visivel ?? true,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.titulo || !form.dataEvento) { toast.error("Preencha título e data"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updateAgenda(editingItem.id, { ...form, dataEvento: new Date(form.dataEvento) } as any)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? result.data : i))
          toast.success("Evento atualizado!")
        } else { toast.error(result.error) }
      } else {
        const result = await createAgenda({ tenantId, ...form, dataEvento: new Date(form.dataEvento) } as any)
        if (result.success) {
          setItems(prev => [result.data, ...prev])
          toast.success("Evento criado!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este evento?")) return
    const result = await deleteAgenda(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluído!")
    }
  }

  const isPast = (date: string) => new Date(date) < new Date()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
              <CalendarDays className="h-4 w-4 text-orange-600" />
            </div>
            Agenda Pública
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Gerencie eventos, visitas e ações</p>
        </div>
        <Button onClick={openNew} className="rounded-xl h-9 text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Novo Evento
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <Card className="rounded-2xl border border-border/60 shadow-sm col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum evento agendado</p>
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id} className={`cursor-pointer rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] group ${isPast(item.dataEvento) ? "opacity-60" : ""}`}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-orange-50 text-center shrink-0">
                <span className="text-[10px] font-bold text-orange-600 uppercase">
                  {new Date(item.dataEvento).toLocaleDateString("pt-BR", { month: "short" })}
                </span>
                <span className="text-xl font-black text-orange-700 leading-none">
                  {new Date(item.dataEvento).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.titulo}</p>
                <div className="flex items-center gap-3 mt-1">
                  {item.local && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.local}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(item.dataEvento).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] font-bold">{TIPO_OPTIONS.find(t => t.value === item.tipo)?.label || item.tipo}</Badge>
                  {!item.visivel && <Badge variant="secondary" className="text-[10px]">Oculto</Badge>}
                  {isPast(item.dataEvento) && <Badge variant="secondary" className="text-[10px]">Passado</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors active:scale-95"><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl p-0 overflow-hidden border-border/60">
          <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
            <DialogTitle className="text-lg">{editingItem ? "Editar Evento" : "Novo Evento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6 pt-2">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm(prev => ({ ...prev, titulo: e.target.value }))} className="rounded-xl h-9" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))} className="rounded-xl" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Local</Label>
                <Input value={form.local} onChange={(e) => setForm(prev => ({ ...prev, local: e.target.value }))} className="rounded-xl h-9" />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm(prev => ({ ...prev, tipo: v }))}>
                  <SelectTrigger className="rounded-xl h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIPO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data e Hora *</Label>
              <Input type="datetime-local" value={form.dataEvento} onChange={(e) => setForm(prev => ({ ...prev, dataEvento: e.target.value }))} className="rounded-xl h-9" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-[13px] font-medium">Visível no site</span>
              <Switch checked={form.visivel} onCheckedChange={(v) => setForm(prev => ({ ...prev, visivel: v }))} className="scale-90" />
            </div>
          </div>
          <DialogFooter className="px-6 pb-6 pt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-9">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-xl h-9">{saving ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
