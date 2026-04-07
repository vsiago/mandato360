"use client"

import { useState } from "react"
import Image from "next/image"
import { Save, User, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { configuracaoVereador as initialConfig } from "@/lib/mock-data"
import type { ConfiguracaoVereador } from "@/lib/mock-data"

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<ConfiguracaoVereador>(initialConfig)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Configuracoes</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure as informacoes do seu mandato
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informacoes do Vereador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-primary" />
              Informacoes do Vereador
            </CardTitle>
            <CardDescription>
              Dados que aparecerao na landing page publica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
                <Image
                  src={config.foto}
                  alt={config.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground">URL da Foto</label>
                <Input
                  value={config.foto}
                  onChange={(e) => setConfig({ ...config, foto: e.target.value })}
                  placeholder="URL da foto"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nome do Vereador</label>
              <Input
                value={config.nome}
                onChange={(e) => setConfig({ ...config, nome: e.target.value })}
                placeholder="Nome completo"
                className="mt-1"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground">Partido</label>
                <Input
                  value={config.partido}
                  onChange={(e) => setConfig({ ...config, partido: e.target.value })}
                  placeholder="Sigla do partido"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <Input
                  value={config.cidade}
                  onChange={(e) => setConfig({ ...config, cidade: e.target.value })}
                  placeholder="Cidade"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Biografia</label>
              <Textarea
                value={config.biografia}
                onChange={(e) => setConfig({ ...config, biografia: e.target.value })}
                placeholder="Biografia do vereador"
                className="mt-1"
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Personalizacao Visual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Palette className="h-5 w-5 text-primary" />
              Personalizacao Visual
            </CardTitle>
            <CardDescription>
              Cores da landing page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground">Cor Primaria</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={config.corPrimaria}
                  onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={config.corPrimaria}
                  onChange={(e) => setConfig({ ...config, corPrimaria: e.target.value })}
                  placeholder="#1e40af"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Cor Secundaria</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={config.corSecundaria}
                  onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded border border-border"
                />
                <Input
                  value={config.corSecundaria}
                  onChange={(e) => setConfig({ ...config, corSecundaria: e.target.value })}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Preview de Cores */}
            <div>
              <label className="text-sm font-medium text-foreground">Preview</label>
              <div className="mt-2 overflow-hidden rounded-lg border border-border">
                <div
                  className="flex h-20 items-center justify-center text-white"
                  style={{ backgroundColor: config.corPrimaria }}
                >
                  <span className="font-semibold">Header da Landing Page</span>
                </div>
                <div
                  className="flex h-12 items-center justify-center text-white"
                  style={{ backgroundColor: config.corSecundaria }}
                >
                  <span className="text-sm">Botoes e Destaques</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botao Salvar */}
      <div className="mt-8 flex items-center justify-end gap-4">
        {isSaved && (
          <span className="text-sm text-emerald-600">Configuracoes salvas com sucesso!</span>
        )}
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configuracoes
        </Button>
      </div>
    </div>
  )
}
