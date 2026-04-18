"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCog, Plus, Pencil, Trash2, Search, Phone, Mail } from "lucide-react"
import { createAssessor, updateAssessor, deleteAssessor } from "@/lib/actions/assessores"
import { toast } from "sonner"

export function AssessoresPageContent({ tenantId, initialData }: { tenantId: string; initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: "", cargo: "", email: "", telefone: "", bairroAtuacao: "", status: "ativo" })

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()))

  const openNew = () => {
    setEditingItem(null)
    setForm({ nome: "", cargo: "", email: "", telefone: "", bairroAtuacao: "", status: "ativo" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({ nome: item.nome, cargo: item.cargo || "", email: item.email || "", telefone: item.telefone || "", bairroAtuacao: item.bairroAtuacao || "", status: item.status || "ativo" })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome) { toast.error("Preencha o nome"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updateAssessor(editingItem.id, form as any)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? result.data : i))
          toast.success("Assessor atualizado!")
        } else { toast.error(result.error) }
      } else {
        const result = await createAssessor({ tenantId, ...form } as any)
        if (result.success) {
          setItems(prev => [result.data, ...prev])
          toast.success("Assessor criado!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este assessor?")) return
    const result = await deleteAssessor(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluído!")
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <UserCog className="h-6 w-6 text-cyan-600" />
            Assessores
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Gerencie sua equipe de assessores</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Novo Assessor
        </Button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar assessor..." className="pl-10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UserCog className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhum assessor cadastrado</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700 shrink-0 uppercase">
                  {item.nome?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{item.nome}</p>
                    <Badge variant={item.status === "ativo" ? "default" : "secondary"} className="text-[10px]">
                      {item.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  {item.cargo && <p className="text-xs text-muted-foreground">{item.cargo}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {item.telefone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{item.telefone}</span>}
                    {item.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{item.email}</span>}
                  </div>
                  {item.bairroAtuacao && <p className="text-xs text-muted-foreground mt-1">Bairro: {item.bairroAtuacao}</p>}
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-7 w-7 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>{editingItem ? "Editar Assessor" : "Novo Assessor"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm(prev => ({ ...prev, cargo: e.target.value }))} placeholder="Assessor Parlamentar" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(e) => setForm(prev => ({ ...prev, telefone: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bairro de Atuação</Label>
                <Input value={form.bairroAtuacao} onChange={(e) => setForm(prev => ({ ...prev, bairroAtuacao: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
