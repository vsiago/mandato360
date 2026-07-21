"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Palette, Globe, MapPin, Phone, AtSign, Lock } from "lucide-react"
import { demoTenant } from "@/lib/demo-data"

export default function DemoConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Configurações</h1>
        <p className="text-[13px] text-muted-foreground">Personalize o mandato</p>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Lock className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 font-medium">
          As configurações estão em modo de visualização no demo. No sistema real, todas as alterações são salvas automaticamente.
        </p>
      </div>

      {/* Perfil */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Perfil do Mandato</CardTitle>
              <CardDescription className="text-xs">Informações do vereador</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Nome</Label>
            <Input defaultValue={demoTenant.name} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Partido</Label>
            <Input defaultValue={demoTenant.partido || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Cidade</Label>
            <Input defaultValue={demoTenant.cidade || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Cargo</Label>
            <Input defaultValue={demoTenant.cargo || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Biografia</Label>
            <Textarea defaultValue={demoTenant.biografia || ""} readOnly className="bg-muted/30 min-h-[80px]" />
          </div>
        </CardContent>
      </Card>

      {/* Cores */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
              <Palette className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Identidade Visual</CardTitle>
              <CardDescription className="text-xs">Cores do mandato</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Cor Primária</Label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg border" style={{ backgroundColor: demoTenant.primaryColor }} />
              <Input defaultValue={demoTenant.primaryColor} readOnly className="bg-muted/30" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg border" style={{ backgroundColor: demoTenant.secondaryColor }} />
              <Input defaultValue={demoTenant.secondaryColor} readOnly className="bg-muted/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <Phone className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">Contato</CardTitle>
              <CardDescription className="text-xs">Dados de contato do mandato</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">WhatsApp</Label>
            <Input defaultValue={demoTenant.whatsapp || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Telefone</Label>
            <Input defaultValue={demoTenant.telefone || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">E-mail</Label>
            <Input defaultValue={demoTenant.email || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Instagram</Label>
            <Input defaultValue={demoTenant.instagram || ""} readOnly className="bg-muted/30" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Endereço</Label>
            <Input defaultValue={demoTenant.endereco || ""} readOnly className="bg-muted/30" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled className="rounded-xl opacity-50">
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
