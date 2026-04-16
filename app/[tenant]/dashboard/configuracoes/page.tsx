"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Save, User, Palette, Loader2, CheckCircle2, AlertTriangle, Globe, MapPin, Phone, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getTenantBySlug, updateTenant } from "@/lib/actions/tenant"
import { toast } from "sonner"

interface TenantConfig {
  nome: string
  partido: string
  cidade: string
  cargo: string
  foto: string
  biografia: string
  corPrimaria: string
  corSecundaria: string
  logoUrl: string
  whatsapp: string
  telefone: string
  email: string
  instagram: string
  endereco: string
  showAgenda: boolean
}

export default function ConfiguracoesPage() {
  const params = useParams()
  const slug = params.tenant as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tenantId, setTenantId] = useState<string>("")
  const [config, setConfig] = useState<TenantConfig>({
    nome: "",
    partido: "",
    cidade: "",
    cargo: "Vereador",
    foto: "",
    biografia: "",
    corPrimaria: "#0F2B5B",
    corSecundaria: "#0D9F6E",
    logoUrl: "",
    whatsapp: "",
    telefone: "",
    email: "",
    instagram: "",
    endereco: "",
    showAgenda: true,
  })

  // Load real tenant data from DB
  useEffect(() => {
    getTenantBySlug(slug).then((tenant) => {
      if (!tenant) {
        setLoading(false)
        return
      }
      setTenantId(tenant.id)
      setConfig({
        nome: tenant.name || "",
        partido: (tenant as any).partido || "",
        cidade: (tenant as any).cidade || "",
        cargo: (tenant as any).cargo || "Vereador",
        foto: tenant.fotoPerfilUrl || "",
        biografia: tenant.biografia || "",
        corPrimaria: tenant.primaryColor || "#0F2B5B",
        corSecundaria: tenant.secondaryColor || "#0D9F6E",
        logoUrl: tenant.logoUrl || "",
        whatsapp: (tenant as any).whatsapp || "",
        telefone: (tenant as any).telefone || "",
        email: (tenant as any).email || "",
        instagram: (tenant as any).instagram || "",
        endereco: (tenant as any).endereco || "",
        showAgenda: (tenant as any).showAgenda ?? true,
      })
      setLoading(false)
    })
  }, [slug])

  const handleSave = async () => {
    if (!tenantId) return
    setSaving(true)

    try {
      const result = await updateTenant(tenantId, {
        name: config.nome,
        partido: config.partido,
        cidade: config.cidade,
        cargo: config.cargo,
        fotoPerfilUrl: config.foto,
        biografia: config.biografia,
        primaryColor: config.corPrimaria,
        secondaryColor: config.corSecundaria,
        logoUrl: config.logoUrl,
        whatsapp: config.whatsapp,
        telefone: config.telefone,
        email: config.email,
        instagram: config.instagram,
        endereco: config.endereco,
        showAgenda: config.showAgenda,
      })

      if (result.success) {
        toast.success("Configurações salvas com sucesso!", {
          description: "As cores e dados serão refletidos no site e no Editor Visual.",
          icon: <CheckCircle2 className="h-4 w-4" />,
        })
      } else {
        toast.error(result.error || "Erro ao salvar")
      }
    } catch {
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Configure as informações do seu mandato. As cores refletem no site e no Editor Visual.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informações do Vereador */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-50 text-blue-600">
                <User className="h-4 w-4" />
              </div>
              Informações do Vereador
            </CardTitle>
            <CardDescription className="text-xs">
              Dados que aparecem na landing page e no perfil público
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted shrink-0 ring-2 ring-border">
                {config.foto ? (
                  <Image
                    src={config.foto}
                    alt={config.nome}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <User className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-xs font-medium text-muted-foreground">URL da Foto</Label>
                <Input
                  value={config.foto}
                  onChange={(e) => setConfig({ ...config, foto: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Nome</Label>
              <Input
                value={config.nome}
                onChange={(e) => setConfig({ ...config, nome: e.target.value })}
                placeholder="Nome completo"
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Cargo</Label>
                <select
                  value={config.cargo}
                  onChange={(e) => setConfig({ ...config, cargo: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="Vereador">Vereador</option>
                  <option value="Candidato a Vereador">Candidato a Vereador</option>
                  <option value="Deputado Estadual">Deputado Estadual</option>
                  <option value="Prefeito">Prefeito</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Partido</Label>
                <Input
                  value={config.partido}
                  onChange={(e) => setConfig({ ...config, partido: e.target.value })}
                  placeholder="REDE"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Cidade</Label>
                <Input
                  value={config.cidade}
                  onChange={(e) => setConfig({ ...config, cidade: e.target.value })}
                  placeholder="Itaguaí"
                  className="mt-1 h-9 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">Biografia</Label>
              <Textarea
                value={config.biografia}
                onChange={(e) => setConfig({ ...config, biografia: e.target.value })}
                placeholder="Conte sua história e propósito..."
                className="mt-1 text-sm min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">URL do Logo</Label>
              <Input
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1 h-9 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Personalização Visual */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-50 text-violet-600">
                  <Palette className="h-4 w-4" />
                </div>
                Cores do Mandato
              </CardTitle>
              <CardDescription className="text-xs">
                Definem o tema do site, sidebar e Editor Visual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Cor Primária</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="color"
                    value={config.corPrimaria}
                    onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-md border border-border p-0.5"
                  />
                  <Input
                    value={config.corPrimaria}
                    onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
                    placeholder="#0F2B5B"
                    className="flex-1 h-9 text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Cor Secundária</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="color"
                    value={config.corSecundaria}
                    onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
                    className="h-9 w-12 cursor-pointer rounded-md border border-border p-0.5"
                  />
                  <Input
                    value={config.corSecundaria}
                    onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
                    placeholder="#0D9F6E"
                    className="flex-1 h-9 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-2 block">Preview</Label>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div
                    className="flex h-16 items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: config.corPrimaria }}
                  >
                    Header / Sidebar
                  </div>
                  <div
                    className="flex h-10 items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: config.corSecundaria }}
                  >
                    Botões e Destaques
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  As cores do "Tema Global" no Editor Visual podem sobrescrever estas cores no site público.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato & Redes */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600">
                  <Phone className="h-4 w-4" />
                </div>
                Contato & Redes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">WhatsApp</Label>
                  <Input
                    value={config.whatsapp}
                    onChange={(e) => setConfig({ ...config, whatsapp: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">Telefone</Label>
                  <Input
                    value={config.telefone}
                    onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                    placeholder="(00) 0000-0000"
                    className="mt-1 h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">E-mail</Label>
                <Input
                  value={config.email}
                  onChange={(e) => setConfig({ ...config, email: e.target.value })}
                  placeholder="contato@exemplo.com"
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Instagram</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">@</span>
                  <Input
                    value={config.instagram}
                    onChange={(e) => setConfig({ ...config, instagram: e.target.value })}
                    placeholder="seu_perfil"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Endereço do Gabinete</Label>
                <Textarea
                  value={config.endereco}
                  onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                  placeholder="Câmara Municipal, Sala 10..."
                  className="mt-1 text-sm min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-50 text-amber-600">
                  <Globe className="h-4 w-4" />
                </div>
                Preferências do Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Agenda Pública</Label>
                  <p className="text-[11px] text-muted-foreground">Exibir agenda de eventos no site público</p>
                </div>
                <Switch
                  checked={config.showAgenda}
                  onCheckedChange={(checked) => setConfig({ ...config, showAgenda: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botão Salvar — Fixed bottom */}
      <div className="mt-8 flex items-center justify-end gap-3 pb-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 px-6 shadow-md"
          style={{ backgroundColor: config.corPrimaria }}
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
