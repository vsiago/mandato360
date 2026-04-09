"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Save, Plus, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import { updateTenant } from "@/lib/actions/tenant"
import { toast } from "sonner"

interface HeroPageProps {
  tenant: any
}

export function HeroPageContent({ tenant }: HeroPageProps) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    heroHeadline: tenant.heroHeadline || "Por uma cidade de",
    heroHighlight: tenant.heroHighlight || "Resultados",
    heroBadge: tenant.heroBadge || "Mandato Participativo",
    heroDescription: tenant.heroDescription || "",
    heroCtaText: tenant.heroCtaText || "Solicitar Demanda",
    heroImageUrl: tenant.heroImageUrl || "",
    tagline: tenant.tagline || "Mandato Participativo",
    showLeis: tenant.showLeis ?? true,
    showIndicacoes: tenant.showIndicacoes ?? true,
    showAgenda: tenant.showAgenda ?? true,
    destaques: (tenant.destaques as { text: string; icon?: string }[]) || [],
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateTenant(tenant.id, {
        heroHeadline: form.heroHeadline,
        heroHighlight: form.heroHighlight,
        heroBadge: form.heroBadge,
        heroDescription: form.heroDescription,
        heroCtaText: form.heroCtaText,
        heroImageUrl: form.heroImageUrl,
        tagline: form.tagline,
        showLeis: form.showLeis,
        showIndicacoes: form.showIndicacoes,
        showAgenda: form.showAgenda,
        destaques: form.destaques,
      } as any)
      if (result.success) {
        toast.success("Hero atualizado com sucesso!")
      } else {
        toast.error(result.error || "Erro ao salvar")
      }
    } finally {
      setSaving(false)
    }
  }

  const addDestaque = () => {
    setForm(prev => ({ ...prev, destaques: [...prev.destaques, { text: "" }] }))
  }

  const removeDestaque = (index: number) => {
    setForm(prev => ({ ...prev, destaques: prev.destaques.filter((_, i) => i !== index) }))
  }

  const updateDestaque = (index: number, text: string) => {
    setForm(prev => ({
      ...prev,
      destaques: prev.destaques.map((d, i) => i === index ? { ...d, text } : d),
    }))
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            Hero & Destaques
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Configure a seção principal do seu site</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hero Content */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Conteúdo do Hero</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Badge (Selo)</Label>
              <Input
                value={form.heroBadge}
                onChange={(e) => setForm(prev => ({ ...prev, heroBadge: e.target.value }))}
                placeholder="Mandato Participativo"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={form.heroHeadline}
                  onChange={(e) => setForm(prev => ({ ...prev, heroHeadline: e.target.value }))}
                  placeholder="Por uma cidade de"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Destaque (colorido)</Label>
                <Input
                  value={form.heroHighlight}
                  onChange={(e) => setForm(prev => ({ ...prev, heroHighlight: e.target.value }))}
                  placeholder="Resultados"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.heroDescription}
                onChange={(e) => setForm(prev => ({ ...prev, heroDescription: e.target.value }))}
                placeholder="Trabalhando pela transparência e inovação política."
                className="rounded-xl"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Texto do Botão CTA</Label>
                <Input
                  value={form.heroCtaText}
                  onChange={(e) => setForm(prev => ({ ...prev, heroCtaText: e.target.value }))}
                  placeholder="Solicitar Demanda"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={form.tagline}
                  onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Mandato Participativo"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>URL da Imagem Hero</Label>
              <Input
                value={form.heroImageUrl}
                onChange={(e) => setForm(prev => ({ ...prev, heroImageUrl: e.target.value }))}
                placeholder="https://..."
                className="rounded-xl"
              />
              {form.heroImageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-border h-32">
                  <img src={form.heroImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visibility & Destaques */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Visibilidade de Seções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  {form.showLeis ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">Leis / Projetos de Lei</span>
                </div>
                <Switch checked={form.showLeis} onCheckedChange={(v) => setForm(prev => ({ ...prev, showLeis: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  {form.showIndicacoes ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">Indicações Legislativas</span>
                </div>
                <Switch checked={form.showIndicacoes} onCheckedChange={(v) => setForm(prev => ({ ...prev, showIndicacoes: v }))} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  {form.showAgenda ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">Agenda Pública</span>
                </div>
                <Switch checked={form.showAgenda} onCheckedChange={(v) => setForm(prev => ({ ...prev, showAgenda: v }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Destaques (Trust Badges)</CardTitle>
                <Button size="sm" variant="outline" onClick={addDestaque} className="rounded-xl gap-1">
                  <Plus className="h-3.5 w-3.5" /> Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {form.destaques.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum destaque adicionado</p>
              )}
              {form.destaques.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={d.text}
                    onChange={(e) => updateDestaque(i, e.target.value)}
                    placeholder="Ex: +200 famílias atendidas"
                    className="rounded-xl flex-1"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeDestaque(i)} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
