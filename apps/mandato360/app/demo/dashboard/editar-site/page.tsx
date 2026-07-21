"use client"

import { Lock, Palette, Globe, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { demoTenant } from "@/lib/demo-data"

export default function DemoEditarSitePage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">Editar Site</h1>
        <p className="text-[13px] text-muted-foreground">Editor visual da landing page do mandato</p>
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <Lock className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 font-medium">
          O editor visual está em modo de visualização no demo. No sistema real, você pode editar cada seção do site ao vivo.
        </p>
      </div>

      {/* Preview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm group hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Globe className="h-7 w-7 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Hero / Banner</h3>
              <p className="text-xs text-muted-foreground mt-1">Seção principal com foto e chamada</p>
            </div>
            <div className="w-full rounded-xl overflow-hidden border border-border/40" style={{ backgroundColor: demoTenant.primaryColor }}>
              <div className="p-4 text-center">
                <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">{demoTenant.heroBadge}</p>
                <p className="text-sm font-bold text-white mt-1">{demoTenant.heroHeadline}</p>
                <p className="text-lg font-black mt-0.5" style={{ color: demoTenant.secondaryColor }}>{demoTenant.heroHighlight}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm group hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100">
              <Palette className="h-7 w-7 text-violet-600" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Cores & Estilo</h3>
              <p className="text-xs text-muted-foreground mt-1">Paleta de cores do site</p>
            </div>
            <div className="w-full flex gap-3 justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-12 w-12 rounded-xl border shadow-sm" style={{ backgroundColor: demoTenant.primaryColor }} />
                <span className="text-[10px] text-muted-foreground font-medium">Primária</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-12 w-12 rounded-xl border shadow-sm" style={{ backgroundColor: demoTenant.secondaryColor }} />
                <span className="text-[10px] text-muted-foreground font-medium">Secundária</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="h-12 w-12 rounded-xl border shadow-sm bg-white" />
                <span className="text-[10px] text-muted-foreground font-medium">Fundo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-sm group hover:shadow-md transition-all">
          <CardContent className="p-5 flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100">
              <Eye className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-semibold text-foreground">Seções do Site</h3>
              <p className="text-xs text-muted-foreground mt-1">Personalize cada seção</p>
            </div>
            <div className="w-full space-y-2">
              {["Quem Sou", "Leis Aprovadas", "Indicações", "Agenda", "Captura de Leads"].map((section) => (
                <div key={section} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                  <span className="text-xs font-medium text-foreground">{section}</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button disabled className="rounded-xl opacity-50 gap-2">
          <Palette className="h-4 w-4" />
          Abrir Editor Visual
        </Button>
      </div>
    </div>
  )
}
