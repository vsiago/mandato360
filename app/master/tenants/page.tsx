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
  Calendar,
  MoreVertical,
  Activity,
  ArrowRight,
  User,
  Shield,
  Palette,
  MapPin,
  Check,
  ChevronLeft
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
    primaryColor: "#f74191",
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
      primaryColor: "#f74191",
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-black text-white uppercase tracking-tight">
            Gestão de <span className="text-accent underline decoration-4 underline-offset-4">Mandatos</span>
          </h1>
          <p className="text-white/60 mt-2 font-medium">
            Gerencie instâncias isoladas para cada munícipio ou vereador.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-primary-foreground font-black px-6 py-6 rounded-xl shadow-[0_0_20px_rgba(247,65,145,0.3)] hover:scale-105 transition-all gap-2">
              <Plus className="h-5 w-5 stroke-3" />
              Novo Mandato
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#112240] border-white/10 text-white max-w-2xl">
            <form onSubmit={handleCreateTenant}>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn("rounded-full px-2 h-5", step === 1 ? "bg-accent" : "bg-emerald-500")}>
                        {step === 1 ? "1/2" : <Check className="h-3 w-3" />}
                    </Badge>
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Provisionamento Integrado</span>
                </div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
                    {step === 1 ? "Configurar Mandato" : "Criar Acesso do Proprietário"}
                </DialogTitle>
                <DialogDescription className="text-white/60">
                  {step === 1 
                    ? "Defina a identidade e localização do novo mandato operacional." 
                    : "Configure as credenciais do vereador ou responsável pelo mandato."}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 min-h-[300px]">
                {step === 1 ? (
                  <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4 col-span-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Nome de Exibição do Mandato</Label>
                            <Input 
                                placeholder="Ex: Mandato Vereador João Silva" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-white/5 border-white/10 h-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Slug da URL</Label>
                        <div className="relative">
                            <Input 
                                placeholder="joao-silva" 
                                value={formData.slug}
                                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                className="bg-white/5 border-white/10 h-10 pl-4"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Cargo</Label>
                        <Select value={formData.cargo} onValueChange={(v) => setFormData({...formData, cargo: v})}>
                            <SelectTrigger className="bg-white/5 border-white/10 h-10">
                                <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#112240] border-white/10 text-white">
                                <SelectItem value="vereador">Vereador</SelectItem>
                                <SelectItem value="deputado_estadual">Deputado Estadual</SelectItem>
                                <SelectItem value="deputado_federal">Deputado Federal</SelectItem>
                                <SelectItem value="prefeito">Prefeito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Partido</Label>
                        <Input 
                            placeholder="Ex: PL, PT, MDB..." 
                            value={formData.partido}
                            onChange={(e) => setFormData({...formData, partido: e.target.value.toUpperCase()})}
                            className="bg-white/5 border-white/10 h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Cidade / Estado</Label>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Cidade" 
                                value={formData.cidade}
                                onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                                className="bg-white/5 border-white/10 h-10"
                            />
                            <Input 
                                placeholder="UF" 
                                maxLength={2}
                                value={formData.estado}
                                onChange={(e) => setFormData({...formData, estado: e.target.value.toUpperCase()})}
                                className="bg-white/5 border-white/10 h-10 w-16 text-center"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Cor de Destaque</Label>
                        <div className="flex gap-3 items-center">
                            <input 
                                type="color" 
                                value={formData.primaryColor}
                                onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                                className="h-10 w-20 bg-transparent border-0 cursor-pointer"
                            />
                            <span className="text-sm font-mono opacity-40 uppercase">{formData.primaryColor}</span>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Nome</Label>
                        <Input 
                            placeholder="João" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="bg-white/5 border-white/10 h-10"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Sobrenome</Label>
                        <Input 
                            placeholder="Silva" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="bg-white/5 border-white/10 h-10"
                        />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">E-mail de Acesso</Label>
                        <Input 
                            type="email"
                            placeholder="joao@exemplo.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-white/5 border-white/10 h-10"
                            required
                        />
                        <p className="text-[10px] text-white/40 italic">Este e-mail será usado para fazer login no painel do mandato.</p>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-white/60">Senha Inicial</Label>
                        <Input 
                            type="password"
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="bg-white/5 border-white/10 h-10"
                            required
                        />
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                {step === 2 && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setStep(1)}
                        className="text-white/60 hover:text-white"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className={cn(
                    "font-black py-6 rounded-xl text-lg uppercase tracking-tighter transition-all",
                    step === 1 ? "w-full bg-white/10 hover:bg-white/20 text-white" : "w-full bg-accent hover:bg-accent/90 text-primary-foreground"
                  )}
                >
                  {isCreating 
                    ? "Provisionando ambiente..." 
                    : step === 1 ? "Próximo Passo" : "Finalizar Cadastro"}
                  {step === 1 && <ChevronRight className="ml-2 h-5 w-5 stroke-3" />}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Total de Ativos</CardDescription>
            <CardTitle className="text-4xl font-black text-white">{tenants.length}</CardTitle>
          </CardHeader>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Building2 size={120} />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Saúde do Sistema</CardDescription>
            <CardTitle className="text-4xl font-black text-emerald-400">99.9%</CardTitle>
          </CardHeader>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Activity size={120} />
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden group">
          <CardHeader className="pb-2">
            <CardDescription className="text-white/40 uppercase font-bold text-[10px] tracking-widest">Domínios Conectados</CardDescription>
            <CardTitle className="text-4xl font-black text-white">{tenants.length}</CardTitle>
          </CardHeader>
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Globe size={120} />
          </div>
        </Card>
      </div>

      {/* Main Table Content */}
      <Card className="bg-[#112240] border-white/10 overflow-hidden shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/2 space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold italic uppercase tracking-tighter">Lista de Mandatos Ativos</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <Input 
                placeholder="Filtrar por nome ou slug..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border-white/10 text-white pl-10 h-10 text-sm focus:border-accent/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white/40 font-bold uppercase text-[10px] tracking-widest h-12">Mandato / Cargo</TableHead>
                <TableHead className="text-white/40 font-bold uppercase text-[10px] tracking-widest h-12">Partido</TableHead>
                <TableHead className="text-white/40 font-bold uppercase text-[10px] tracking-widest h-12">URL / Slug</TableHead>
                <TableHead className="text-white/40 font-bold uppercase text-[10px] tracking-widest h-12">Geográfico</TableHead>
                <TableHead className="text-white/40 font-bold uppercase text-[10px] tracking-widest h-12 text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell colSpan={5} className="h-16 text-center text-white/20 animate-pulse">Carregando mandatos...</TableCell>
                  </TableRow>
                ))
              ) : filteredTenants.length === 0 ? (
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 opacity-20">
                      <Building2 size={64} />
                      <p className="font-bold uppercase tracking-widest text-sm">Nenhum mandato encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTenants.map((t) => {
                  const config = parseConfig(t.config)
                  return (
                    <TableRow key={t.id} className="border-white/5 hover:bg-white/2 group transition-colors">
                        <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                            <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg"
                                style={{ backgroundColor: config.primaryColor || '#f74191' }}
                            >
                            {t.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-white group-hover:text-accent transition-colors leading-none">{t.name}</span>
                                <span className="text-[10px] uppercase font-bold text-white/40 mt-1">{config.cargo || 'Não definido'}</span>
                            </div>
                        </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="border-white/10 text-white/80 bg-white/5">
                                {config.partido || '---'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 font-mono text-[11px] px-3 py-1 lowercase">
                            /{t.slug}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-white/40 text-xs font-medium">
                            <div className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-accent" />
                                {config.cidade ? `${config.cidade}/${config.estado}` : 'Brasil'}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-white/40 hover:text-white hover:bg-white/5 group/btn overflow-hidden"
                            onClick={() => window.open(`/${t.slug}`, '_blank')}
                        >
                            <span className="mr-2 opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">Acessar</span>
                            <ExternalLink size={16} />
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
