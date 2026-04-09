"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Save } from "lucide-react"
import { updateTenant } from "@/lib/actions/tenant"
import { toast } from "sonner"

export function QuemSouContent({ tenant }: { tenant: any }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: tenant.name || "",
    biografia: tenant.biografia || "",
    partido: tenant.partido || "",
    cidade: tenant.cidade || "",
    cargo: tenant.cargo || "Vereador",
    fotoPerfilUrl: tenant.fotoPerfilUrl || "",
    logoUrl: tenant.logoUrl || "",
    primaryColor: tenant.primaryColor || "#0F2B5B",
    secondaryColor: tenant.secondaryColor || "#0D9F6E",
    whatsapp: tenant.whatsapp || "",
    telefone: tenant.telefone || "",
    email: tenant.email || "",
    instagram: tenant.instagram || "",
    endereco: tenant.endereco || "",
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateTenant(tenant.id, form as any)
      if (result.success) {
        toast.success("Perfil atualizado com sucesso!")
      } else {
        toast.error(result.error || "Erro ao salvar")
      }
    } finally { setSaving(false) }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Quem Sou
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Edite seu perfil público e informações de contato</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl gap-2">
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Perfil */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Dados do Vereador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Partido</Label>
                <Input value={form.partido} onChange={(e) => setForm(prev => ({ ...prev, partido: e.target.value }))} placeholder="REDE" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input value={form.cidade} onChange={(e) => setForm(prev => ({ ...prev, cidade: e.target.value }))} placeholder="Itaguaí" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm(prev => ({ ...prev, cargo: e.target.value }))} placeholder="Vereador" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Biografia</Label>
              <Textarea value={form.biografia} onChange={(e) => setForm(prev => ({ ...prev, biografia: e.target.value }))} placeholder="Conte sua história..." className="rounded-xl" rows={5} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Identidade Visual */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Identidade Visual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Foto de Perfil (URL)</Label>
                <Input value={form.fotoPerfilUrl} onChange={(e) => setForm(prev => ({ ...prev, fotoPerfilUrl: e.target.value }))} placeholder="https://..." className="rounded-xl" />
                {form.fotoPerfilUrl && (
                  <div className="mt-2 h-20 w-20 rounded-xl overflow-hidden border">
                    <img src={form.fotoPerfilUrl} alt="Foto" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Logo (URL)</Label>
                <Input value={form.logoUrl} onChange={(e) => setForm(prev => ({ ...prev, logoUrl: e.target.value }))} placeholder="https://..." className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2">
                    <input type="color" value={form.primaryColor} onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))} className="h-10 w-12 rounded-lg border border-border cursor-pointer" />
                    <Input value={form.primaryColor} onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))} className="rounded-xl flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex gap-2">
                    <input type="color" value={form.secondaryColor} onChange={(e) => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))} className="h-10 w-12 rounded-lg border border-border cursor-pointer" />
                    <Input value={form.secondaryColor} onChange={(e) => setForm(prev => ({ ...prev, secondaryColor: e.target.value }))} className="rounded-xl flex-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={(e) => setForm(prev => ({ ...prev, whatsapp: e.target.value }))} placeholder="(21) 99999-1234" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.telefone} onChange={(e) => setForm(prev => ({ ...prev, telefone: e.target.value }))} placeholder="(21) 3333-1234" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="contato@vereador.com" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={form.instagram} onChange={(e) => setForm(prev => ({ ...prev, instagram: e.target.value }))} placeholder="@vereador" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input value={form.endereco} onChange={(e) => setForm(prev => ({ ...prev, endereco: e.target.value }))} placeholder="Rua..." className="rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
