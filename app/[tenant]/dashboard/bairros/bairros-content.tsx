"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MapPin, Plus, Pencil, Trash2, Search } from "lucide-react"
import { createBairro, updateBairro, deleteBairro } from "@/lib/actions/bairros"
import { toast } from "sonner"

export function BairrosPageContent({ tenantId, initialData }: { tenantId: string; initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: "", zona: "", observacoes: "" })

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()))

  const openNew = () => {
    setEditingItem(null)
    setForm({ nome: "", zona: "", observacoes: "" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({ nome: item.nome, zona: item.zona || "", observacoes: item.observacoes || "" })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome) { toast.error("Preencha o nome do bairro"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updateBairro(editingItem.id, form)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? result.data : i))
          toast.success("Bairro atualizado!")
        } else { toast.error(result.error) }
      } else {
        const result = await createBairro({ tenantId, ...form })
        if (result.success) {
          setItems(prev => [...prev, result.data])
          toast.success("Bairro criado!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este bairro?")) return
    const result = await deleteBairro(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluído!")
    } else { toast.error(result.error) }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
              <MapPin className="h-4 w-4 text-rose-600" />
            </div>
            Bairros
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Cadastre os bairros do município</p>
        </div>
        <Button onClick={openNew} className="rounded-xl h-9 text-[13px] gap-2 shadow-sm transition-all active:scale-[0.98]">
          <Plus className="h-4 w-4" /> Novo Bairro
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar bairro..." className="pl-10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <Card className="rounded-2xl border border-border/60 shadow-sm col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum bairro cadastrado</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((item) => (
          <Card key={item.id} className="cursor-pointer rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.nome}</p>
                  {item.zona && <p className="text-[12px] font-medium text-muted-foreground mt-0.5">Zona: {item.zona}</p>}
                  {item.observacoes && <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2">{item.observacoes}</p>}
                </div>
                <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors active:scale-95"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors active:scale-95"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl p-0 overflow-hidden border-border/60">
          <DialogHeader className="px-6 pt-6 pb-4 bg-muted/30 border-b border-border/40">
            <DialogTitle className="text-lg">{editingItem ? "Editar Bairro" : "Novo Bairro"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6 pt-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))} className="rounded-xl h-9" />
            </div>
            <div className="space-y-2">
              <Label>Zona</Label>
              <Input value={form.zona} onChange={(e) => setForm(prev => ({ ...prev, zona: e.target.value }))} placeholder="Norte, Sul, Centro..." className="rounded-xl h-9" />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm(prev => ({ ...prev, observacoes: e.target.value }))} className="rounded-xl" rows={3} />
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
