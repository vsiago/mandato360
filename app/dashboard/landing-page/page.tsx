"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  ExternalLink, 
  Eye, 
  Save, 
  Upload,
  FileText,
  CheckCircle2,
  TrendingUp,
  Newspaper,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Settings,
  Palette,
  Type,
  LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  configuracaoVereador as initialConfig,
  projetosLei,
  leisAprovadas,
  publicacoes,
} from "@/lib/mock-data"

export default function LandingPageConfigPage() {
  const [config, setConfig] = useState({
    ...initialConfig,
    heroTitulo: 'Trabalhando todos os dias por uma cidade melhor',
    heroSubtitulo: 'Nosso mandato e dedicado a ouvir, representar e transformar as demandas da populacao em acoes concretas para o bem de todos.',
    telefone: '(11) 3333-4444',
    email: 'gabinete@vereador.gov.br',
    instagram: 'https://instagram.com',
    familiasAtendidas: '500+',
    bairrosAlcancados: '12',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Landing Page do Vereador</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Configure e personalize sua pagina publica
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/vereador" target="_blank">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Alteracoes'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{projetosLei.length}</p>
              <p className="text-xs text-muted-foreground">Projetos de Lei</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{leisAprovadas.length}</p>
              <p className="text-xs text-muted-foreground">Leis Aprovadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{projetosLei.filter(p => p.status === 'tramitando').length}</p>
              <p className="text-xs text-muted-foreground">Em Tramitacao</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Newspaper className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{publicacoes.length}</p>
              <p className="text-xs text-muted-foreground">Publicacoes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="geral" className="gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="historia" className="gap-2">
            <Type className="h-4 w-4" />
            Historia
          </TabsTrigger>
          <TabsTrigger value="indicadores" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Indicadores
          </TabsTrigger>
          <TabsTrigger value="contato" className="gap-2">
            <Phone className="h-4 w-4" />
            Contato
          </TabsTrigger>
          <TabsTrigger value="redes" className="gap-2">
            <Instagram className="h-4 w-4" />
            Redes Sociais
          </TabsTrigger>
        </TabsList>

        {/* Geral Tab */}
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Informacoes Gerais</CardTitle>
              <CardDescription>Configure as informacoes basicas do vereador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Vereador</label>
                  <Input
                    value={config.nome}
                    onChange={(e) => setConfig({ ...config, nome: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Partido</label>
                  <Input
                    value={config.partido}
                    onChange={(e) => setConfig({ ...config, partido: e.target.value })}
                    placeholder="Sigla do partido"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cidade</label>
                  <Input
                    value={config.cidade}
                    onChange={(e) => setConfig({ ...config, cidade: e.target.value })}
                    placeholder="Nome da cidade"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foto de Perfil</label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={config.foto}
                        alt={config.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Alterar Foto
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Secao Hero</CardTitle>
              <CardDescription>Configure a secao principal da landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titulo Principal</label>
                <Input
                  value={config.heroTitulo}
                  onChange={(e) => setConfig({ ...config, heroTitulo: e.target.value })}
                  placeholder="Titulo que aparece na hero"
                />
                <p className="text-xs text-muted-foreground">Exemplo: Trabalhando todos os dias por uma cidade melhor</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitulo</label>
                <Textarea
                  value={config.heroSubtitulo}
                  onChange={(e) => setConfig({ ...config, heroSubtitulo: e.target.value })}
                  placeholder="Texto de apoio abaixo do titulo"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Imagem da Hero</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={config.foto}
                      alt="Hero"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Imagem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historia Tab */}
        <TabsContent value="historia">
          <Card>
            <CardHeader>
              <CardTitle>Historia do Vereador</CardTitle>
              <CardDescription>Conte a trajetoria e conquistas do parlamentar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Biografia</label>
                <Textarea
                  value={config.biografia}
                  onChange={(e) => setConfig({ ...config, biografia: e.target.value })}
                  placeholder="Conte a historia do vereador..."
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">Descreva a trajetoria politica, formacao e principais conquistas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indicadores Tab */}
        <TabsContent value="indicadores">
          <Card>
            <CardHeader>
              <CardTitle>Indicadores do Mandato</CardTitle>
              <CardDescription>Configure os numeros que aparecem na landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Familias Atendidas</label>
                  <Input
                    value={config.familiasAtendidas}
                    onChange={(e) => setConfig({ ...config, familiasAtendidas: e.target.value })}
                    placeholder="Ex: 500+"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bairros Alcancados</label>
                  <Input
                    value={config.bairrosAlcancados}
                    onChange={(e) => setConfig({ ...config, bairrosAlcancados: e.target.value })}
                    placeholder="Ex: 12"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Os seguintes indicadores sao calculados automaticamente a partir dos dados cadastrados:
                </p>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="bg-background rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{projetosLei.length}</p>
                    <p className="text-xs text-muted-foreground">Projetos de Lei</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{leisAprovadas.length}</p>
                    <p className="text-xs text-muted-foreground">Leis Aprovadas</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{projetosLei.filter(p => p.status === 'tramitando').length}</p>
                    <p className="text-xs text-muted-foreground">Em Tramitacao</p>
                  </div>
                  <div className="bg-background rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{publicacoes.length}</p>
                    <p className="text-xs text-muted-foreground">Publicacoes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contato Tab */}
        <TabsContent value="contato">
          <Card>
            <CardHeader>
              <CardTitle>Informacoes de Contato</CardTitle>
              <CardDescription>Configure os dados de contato do gabinete</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={config.telefone}
                      onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                      placeholder="(11) 3333-4444"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={config.email}
                      onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      placeholder="gabinete@vereador.gov.br"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redes Sociais Tab */}
        <TabsContent value="redes">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Configure os links das redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link do Instagram</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={config.instagram}
                    onChange={(e) => setConfig({ ...config, instagram: e.target.value })}
                    placeholder="https://instagram.com/seuperfil"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Cole o link completo do perfil do Instagram</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Content Links */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Projetos de Lei</h3>
                <p className="text-sm text-muted-foreground">Gerencie na secao dedicada</p>
              </div>
              <Link href="/dashboard/projetos-lei">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Leis Aprovadas</h3>
                <p className="text-sm text-muted-foreground">Gerencie na secao de projetos</p>
              </div>
              <Link href="/dashboard/projetos-lei">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Newspaper className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Publicacoes</h3>
                <p className="text-sm text-muted-foreground">Gerencie na secao dedicada</p>
              </div>
              <Link href="/dashboard/publicacoes">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
