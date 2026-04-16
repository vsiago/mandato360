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
import { ClipboardList, Plus, Pencil, Trash2, Eye, Link2, BarChart3, ExternalLink } from "lucide-react"
import { createPesquisa, updatePesquisa, deletePesquisa } from "@/lib/actions/pesquisas"
import { toast } from "sonner"
import type { PesquisaPergunta } from "@/lib/db/schema"

const STATUS_COLORS: Record<string, string> = {
  rascunho: "#94A3B8",
  ativa: "#10B981",
  encerrada: "#EF4444",
}

export function PesquisasPageContent({ tenantId, tenantSlug, initialData }: { tenantId: string; tenantSlug: string; initialData: any[] }) {
  const [items, setItems] = useState(initialData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<{
    titulo: string; descricao: string; status: string; publica: boolean; perguntas: PesquisaPergunta[]
  }>({ titulo: "", descricao: "", status: "rascunho", publica: false, perguntas: [] })

  const openNew = () => {
    setEditingItem(null)
    setForm({ titulo: "", descricao: "", status: "rascunho", publica: false, perguntas: [] })
    setIsDialogOpen(true)
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setForm({
      titulo: item.titulo,
      descricao: item.descricao || "",
      status: item.status,
      publica: item.publica,
      perguntas: item.perguntas || [],
    })
    setIsDialogOpen(true)
  }

  const addPergunta = (type: "text" | "choice" | "checkbox" | "scale") => {
    setForm(prev => ({
      ...prev,
      perguntas: [...prev.perguntas, { id: crypto.randomUUID(), type, question: "", options: type !== "text" && type !== "scale" ? [""] : undefined, required: false }],
    }))
  }

  const updatePergunta = (index: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }))
  }

  const removePergunta = (index: number) => {
    setForm(prev => ({ ...prev, perguntas: prev.perguntas.filter((_, i) => i !== index) }))
  }

  const addOption = (perguntaIndex: number) => {
    setForm(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((p, i) => i === perguntaIndex ? { ...p, options: [...(p.options || []), ""] } : p),
    }))
  }

  const updateOption = (perguntaIndex: number, optIndex: number, value: string) => {
    setForm(prev => ({
      ...prev,
      perguntas: prev.perguntas.map((p, i) => {
        if (i !== perguntaIndex) return p
        const opts = [...(p.options || [])]
        opts[optIndex] = value
        return { ...p, options: opts }
      }),
    }))
  }

  const handleSave = async () => {
    if (!form.titulo) { toast.error("Preencha o título"); return }
    setSaving(true)
    try {
      if (editingItem) {
        const result = await updatePesquisa(editingItem.id, form as any)
        if (result.success) {
          setItems(prev => prev.map(i => i.id === editingItem.id ? result.data : i))
          toast.success("Pesquisa atualizada!")
        } else { toast.error(result.error) }
      } else {
        const result = await createPesquisa({ tenantId, ...form } as any)
        if (result.success) {
          setItems(prev => [result.data, ...prev])
          toast.success("Pesquisa criada!")
        } else { toast.error(result.error) }
      }
      setIsDialogOpen(false)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta pesquisa e todas as respostas?")) return
    const result = await deletePesquisa(id)
    if (result.success) {
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Excluída!")
    }
  }

  const TIPO_LABELS: Record<string, string> = { text: "Texto", choice: "Múltipla Escolha", checkbox: "Caixa de Seleção", scale: "Escala 1-10" }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-600" />
            Pesquisas
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Crie pesquisas estilo Google Forms</p>
        </div>
        <Button onClick={openNew} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Nova Pesquisa
        </Button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">Nenhuma pesquisa criada</p>
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 shrink-0">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{(item.perguntas || []).length} perguntas</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] font-bold"
                    style={{ backgroundColor: `${STATUS_COLORS[item.status]}15`, color: STATUS_COLORS[item.status] }}
                  >
                    {item.status === "rascunho" ? "Rascunho" : item.status === "ativa" ? "Ativa" : "Encerrada"}
                  </Badge>
                  {item.publica && <Badge variant="secondary" className="text-[10px] gap-1"><Eye className="h-3 w-3" /> Pública</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {item.publica && item.status === "ativa" && (
                  <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                    <a href={`/${tenantSlug}/pesquisa/${item.id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => openEdit(item)} className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItem ? "Editar Pesquisa" : "Nova Pesquisa"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.titulo} onChange={(e) => setForm(prev => ({ ...prev, titulo: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))} className="rounded-xl" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="encerrada">Encerrada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-1">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 w-full">
                  <span className="text-sm font-medium flex-1">Pública</span>
                  <Switch checked={form.publica} onCheckedChange={(v) => setForm(prev => ({ ...prev, publica: v }))} />
                </div>
              </div>
            </div>

            {/* Perguntas Builder */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Perguntas</Label>
                <div className="flex gap-1">
                  {(["text", "choice", "checkbox", "scale"] as const).map(type => (
                    <Button key={type} size="sm" variant="outline" onClick={() => addPergunta(type)} className="rounded-lg text-xs">
                      + {TIPO_LABELS[type]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {form.perguntas.map((p, i) => (
                  <Card key={p.id} className="border shadow-none rounded-xl">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-bold">{TIPO_LABELS[p.type]}</Badge>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Obrigatória</Label>
                          <Switch checked={p.required} onCheckedChange={(v) => updatePergunta(i, "required", v)} />
                          <Button size="icon" variant="ghost" onClick={() => removePergunta(i)} className="h-7 w-7 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      <Input
                        value={p.question}
                        onChange={(e) => updatePergunta(i, "question", e.target.value)}
                        placeholder="Digite a pergunta..."
                        className="rounded-xl font-medium"
                      />
                      {(p.type === "choice" || p.type === "checkbox") && p.options && (
                        <div className="space-y-2 pl-4">
                          {p.options.map((opt, oi) => (
                            <Input
                              key={oi}
                              value={opt}
                              onChange={(e) => updateOption(i, oi, e.target.value)}
                              placeholder={`Opção ${oi + 1}`}
                              className="rounded-xl text-sm"
                            />
                          ))}
                          <Button size="sm" variant="ghost" onClick={() => addOption(i)} className="text-xs gap-1">
                            <Plus className="h-3 w-3" /> Adicionar opção
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
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
