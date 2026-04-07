"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  Building2, 
  ChevronRight, 
  ExternalLink,
  Globe,
  MoreVertical,
  Activity,
  ArrowRight,
  User,
  Shield,
  Palette,
  MapPin,
  Check,
  ChevronLeft,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getAllTenants, createTenantWithOwner } from "@/lib/actions/tenant"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [step, setStep] = useState(1)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    cargo: "vereador",
    partido: "",
    cidade: "",
    estado: "",
    primaryColor: "#0D9F6E",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const router = useRouter()

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    setIsLoading(true)
    try {
      const data = await getAllTenants()
      setTenants(data)
    } catch (error) {
      toast.error("Erro ao carregar mandatos")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate slug from name
  useEffect(() => {
    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
    setFormData(prev => ({ ...prev, slug }))
  }, [formData.name])

  async function handleCreateTenant(e: React.FormEvent) {
    e.preventDefault()
    
    if (step === 1) {
      if (!formData.name || !formData.slug || !formData.partido) {
        toast.error("Preencha os dados do mandato")
        return
      }
      setStep(2)
      return
    }

    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error("Preencha os dados de acesso")
      return
    }

    setIsCreating(true)
    const config = JSON.stringify({
      cargo: formData.cargo,
      partido: formData.partido,
      cidade: formData.cidade,
      estado: formData.estado,
      primaryColor: formData.primaryColor,
      brandName: formData.name
    })

    const result = await createTenantWithOwner({
      name: formData.name,
      slug: formData.slug,
      config,
      ownerName: `${formData.firstName} ${formData.lastName}`.trim(),
      ownerEmail: formData.email,
      ownerPassword: formData.password
    })

    if (result.success) {
      toast.success("Mandato e Proprietário criados com sucesso!")
      setIsDialogOpen(false)
      resetForm()
      fetchTenants()
    } else {
      // @ts-ignore
      toast.error(result.error || "Erro ao processar cadastro")
    }
    setIsCreating(false)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      cargo: "vereador",
      partido: "",
      cidade: "",
      estado: "",
      primaryColor: "#0D9F6E",
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    })
    setStep(1)
  }

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const parseConfig = (config: string | null) => {
    try {
      return config ? JSON.parse(config) : {}
    } catch {
      return {}
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Gestão de Mandatos</h1>
          <p className="text-sm text-muted-foreground font-medium">Provisionamento de instâncias e ambientes</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex gap-1.5 border-secondary/40 bg-secondary/5 text-secondary text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
            Infraestrutura Ativa
          </Badge>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-4 h-9 rounded-lg shadow-sm transition-all gap-2 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Novo Mandato
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border shadow-2xl rounded-2xl">
              {/* Form content remains same */}
              <form onSubmit={handleCreateTenant}>
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <Badge variant="secondary" className="rounded-full px-2.5 h-6 font-bold text-[10px] uppercase tracking-wider">
                            Passo {step}/2
                        </Badge>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Provisionamento</span>
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-primary">
                        {step === 1 ? "Identidade do Mandato" : "Acesso Administrativo"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                    {step === 1 
                        ? "Configure os dados públicos e o endereçamento do novo mandato." 
                        : "Defina as credenciais para o responsável acessar o painel."}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 min-h-[300px]">
                    {step === 1 ? (
                    <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4 col-span-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome de Exibição</Label>
                                <Input 
                                    placeholder="Ex: Mandato Vereador João Silva" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">URL Slug</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs">/</span>
                                <Input 
                                    placeholder="joao-silva" 
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    className="bg-muted/30 border-border h-11 pl-6 text-sm focus:bg-white transition-colors rounded-lg"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cargo Público</Label>
                            <Select value={formData.cargo} onValueChange={(v) => setFormData({...formData, cargo: v})}>
                                <SelectTrigger className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vereador">Vereador</SelectItem>
                                    <SelectItem value="deputado_estadual">Deputado Estadual</SelectItem>
                                    <SelectItem value="deputado_federal">Deputado Federal</SelectItem>
                                    <SelectItem value="prefeito">Prefeito</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Partido</Label>
                            <Input 
                                placeholder="Sigla" 
                                value={formData.partido}
                                onChange={(e) => setFormData({...formData, partido: e.target.value.toUpperCase()})}
                                className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cidade / UF</Label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Cidade" 
                                    value={formData.cidade}
                                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                                    className="bg-muted/30 border-border h-11 flex-1 text-sm focus:bg-white transition-colors rounded-lg"
                                />
                                <Input 
                                    placeholder="UF" 
                                    maxLength={2}
                                    value={formData.estado}
                                    onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                                    className="bg-muted/30 border-border h-11 w-14 text-center text-sm focus:bg-white transition-colors rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                    ) : (
                    <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Primeiro Nome</Label>
                            <Input 
                                placeholder="João" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sobrenome</Label>
                            <Input 
                                placeholder="Silva" 
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">E-mail de Acesso</Label>
                            <Input 
                                type="email"
                                placeholder="nome@mandato.pt" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                                required
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Senha Inicial</Label>
                            <Input 
                                type="password"
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="bg-muted/30 border-border h-11 text-sm focus:bg-white transition-colors rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    )}
                </div>

                <DialogFooter className="gap-3 sm:gap-0 pt-4 border-t border-border/50">
                    {step === 2 && (
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => setStep(1)}
                            className="text-muted-foreground font-bold hover:bg-muted h-10 rounded-lg text-xs"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                        </Button>
                    )}
                    <Button 
                    type="submit" 
                    disabled={isCreating}
                    className={cn(
                        "font-bold h-10 rounded-lg text-xs transition-all flex-1",
                        step === 1 ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"
                    )}
                    >
                    {isCreating 
                        ? "Provisionando..." 
                        : step === 1 ? "Próximo Passo" : "Finalizar Cadastro"}
                    {step === 1 && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Mandatos */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Total de Mandatos</span>
              <span className="text-2xl font-bold text-foreground">{tenants.length}</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none text-[10px] font-bold">ATIVA</Badge>
            <span className="text-xs text-muted-foreground">provisionados</span>
          </div>
        </div>

        {/* Status Servidor */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Status do Servidor</span>
              <span className="text-2xl font-bold text-foreground">99.9%</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs font-medium text-secondary">Online</span>
            <span className="text-xs text-muted-foreground">sem incidentes</span>
          </div>
        </div>

        {/* Uptime */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">Uptime Mensal</span>
              <span className="text-2xl font-bold text-foreground">720h</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-semibold text-blue-600">Disponível</span> em todos os clusters
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 px-6 border-b border-border/50">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Instâncias Ativas</h2>
            <p className="text-[11px] text-muted-foreground font-medium">Controle de ambiente por slug de URL</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input 
              placeholder="Buscar mandato..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/40 border-none text-foreground pl-9 h-9 text-xs focus:bg-muted/60 transition-colors rounded-lg"
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest h-11 px-6">Identificação</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest h-11">Partido</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest h-11">URL Mapping</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest h-11">Localização</TableHead>
                <TableHead className="text-muted-foreground font-bold uppercase text-[9px] tracking-widest h-11 text-right px-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-border/40">
                    <TableCell colSpan={5} className="h-20 px-6">
                        <div className="h-3 bg-muted animate-pulse rounded-full w-48 opacity-40" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTenants.length === 0 ? (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground/30">
                        <Building2 size={24} />
                      </div>
                      <p className="font-medium text-muted-foreground text-xs">Nenhum mandato provisionado.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((t) => {
                  const config = parseConfig(t.config)
                  return (
                    <TableRow key={t.id} className="border-border/40 hover:bg-muted/5 transition-colors">
                        <TableCell className="py-4 px-6">
                            <div className="flex items-center gap-3">
                                <div 
                                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                                    style={{ backgroundColor: config.primaryColor || '#0F2B5B' }}
                                >
                                {t.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-foreground truncate text-sm leading-tight">{t.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight mt-0.5">{config.cargo || 'Vereador'}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="border-border text-muted-foreground font-bold bg-white text-[10px] px-2 py-0.5">
                                {config.partido || '---'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <code className="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
                                /{t.slug}
                            </code>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-medium">
                                <MapPin size={12} className="text-secondary/60" />
                                {config.cidade ? `${config.cidade}/${config.estado}` : 'Brasil'}
                            </div>
                        </TableCell>
                        <TableCell className="text-right px-6">
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-muted-foreground hover:text-primary hover:bg-muted rounded-lg h-8 px-3 text-xs font-semibold gap-1.5 transition-all"
                                onClick={() => window.open(`/${t.slug}`, '_blank')}
                            >
                                <ExternalLink size={14} />
                                Acessar
                            </Button>
                        </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
