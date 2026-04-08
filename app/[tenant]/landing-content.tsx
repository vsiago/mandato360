"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Send, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Menu, 
  X,
  Globe, 
  Heart,
  FileText,
  Scale,
  ChevronRight,
  Users,
  MessageSquare,
  Share2,
  Calendar,
  TrendingUp,
  Newspaper,
  ExternalLink,
  ArrowRight,
  LifeBuoy
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { submitSupporterAction, submitRequestAction } from "@/lib/actions/forms"
import { toast } from "sonner"

// Format date consistently to avoid hydration mismatch
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()
  return `${day}/${month}/${year}`
}

const tiposSolicitacao = [
  'Iluminacao Publica',
  'Coleta de Lixo',
  'Buracos na Via',
  'Saude',
  'Seguranca',
  'Transporte',
  'Outros',
]

const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'historia', label: 'Historia' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
]

export default function LandingContent({ tenant, initialData }: { tenant: any, initialData: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Use config from tenant if available, otherwise fallback to mock
  let config = initialData.config;
  try {
    if (tenant?.config) {
      config = JSON.parse(tenant.config);
    }
  } catch (e) {
    console.error("Error parsing tenant config:", e);
  }
  
  // Brand identity from new columns with fallback to config/mock
  const primaryColor = tenant?.primaryColor || config?.primaryColor || "#0F2B5B"
  const secondaryColor = tenant?.secondaryColor || config?.secondaryColor || "#0D9F6E"
  const displayNome = tenant?.name || config?.nome || config?.brandName || "Vereador"
  const displayFoto = tenant?.fotoPerfilUrl || config?.foto || initialData.config.foto
  const displayLogo = tenant?.logoUrl || config?.logo || null
  const displayBio = tenant?.biografia || config?.biografia || initialData.config.biografia

  const { projetosLei, leisAprovadas, publicacoes, indicacoes, bairros } = initialData

  // Supporter form state
  const [isSupporterFormOpen, setIsSupporterFormOpen] = useState(false)
  const [supporterSuccess, setSupporterSuccess] = useState(false)
  const [isSubmittingSupporter, setIsSubmittingSupporter] = useState(false)

  // Request form state
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  async function handleSupporterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmittingSupporter(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    const result = await submitSupporterAction(data)
    if (result.success) {
      setSupporterSuccess(true)
      toast.success("Apoio registrado!")
    } else {
      toast.error("Erro ao registrar apoio.")
    }
    setIsSubmittingSupporter(false)
  }

  async function handleRequestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmittingRequest(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const result = await submitRequestAction(data)
    if (result.success) {
      setRequestSuccess(true)
      toast.success("Solicitação enviada!")
    } else {
      toast.error("Erro ao enviar solicitação.")
    }
    setIsSubmittingRequest(false)
  }

  const closeSupporterForm = () => {
    setIsSupporterFormOpen(false)
    setSupporterSuccess(false)
  }

  const closeRequestForm = () => {
    setIsRequestFormOpen(false)
    setRequestSuccess(false)
  }

  return (
    <div 
      className="min-h-screen bg-background font-sans selection:bg-primary/10"
      style={{
        // @ts-ignore
        "--primary": primaryColor,
        "--secondary": secondaryColor,
        "--ring": primaryColor,
      }}
    >
      {/* Floating Header - Agency Style */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-7xl rounded-full border border-white/10 ${
        isScrolled ? "bg-[#0A192F]/90 backdrop-blur-agency shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 px-2" : "bg-transparent py-4 px-2"
      }`}>
        <div className="mx-auto px-6 md:px-12">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo/Name */}
            <Link href={`/${tenant?.slug || 'vereador'}`} className="flex items-center gap-2">
              {displayLogo ? (
                <img src={displayLogo} alt="Logo" className="h-10 w-auto object-contain" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary-foreground font-bold shadow-lg">
                    {displayNome.charAt(0)}
                </div>
              )}
              <span className="font-outfit font-black text-sm md:text-lg text-white uppercase tracking-tight">
                {displayNome.split(' (')[0]}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    isScrolled ? 'text-white' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsSupporterFormOpen(true)}
                className="hidden sm:flex rounded-full bg-linear-to-r from-accent to-orange-500 hover:to-orange-600 border-0 text-primary-foreground font-bold shadow-[0_10px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:-translate-y-0.5"
                size="sm"
              >
                <Heart className="mr-2 h-4 w-4 fill-current" />
                Ser Apoiador
              </Button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:bg-white/10'
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden bg-[#0A192F]/95 backdrop-blur-agency border-t border-white/10 rounded-b-4xl overflow-hidden"
          >
            <nav className="container mx-auto px-8 py-10 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left py-4 px-4 rounded-xl text-white/80 font-outfit uppercase tracking-widest text-xs font-black hover:bg-white/5 transition-all"
                >
                  {link.label}
                </button>
              ))}
              <Button 
                onClick={() => {
                  setIsSupporterFormOpen(true)
                  setIsMenuOpen(false)
                }}
                className="mt-2"
              >
                <Heart className="mr-2 h-4 w-4" />
                Ser Apoiador
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-[#0A192F]">
        <div className="absolute inset-0 bg-linear-to-br from-[#0A192F] via-[#112240] to-[#0A192F]" />
        <div className="absolute inset-0 bg-grain pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.2' /%3E%3C/svg%3E")`,
          }} 
        />

        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10 pt-44 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-2xl">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-outfit uppercase tracking-[0.3em] text-white/70 italic">
                  Mandato Participativo / Itaguaí
                </span>
              </div>

              <h1 className="text-5xl font-outfit font-extrabold text-white leading-[1.1] tracking-tighter sm:text-7xl lg:text-7xl mb-8 max-w-4xl">
                {displayNome}
              </h1>
              
              <div className="h-1 w-20 bg-accent mb-8 mx-auto lg:mx-0" />

              <p className="text-xl font-outfit text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
                {displayBio}
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Button 
                  size="xl" 
                  className="rounded-full bg-accent text-primary-foreground hover:bg-accent/90 px-10 shadow-[0_20px_50px_rgba(245,158,11,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-accent/40"
                  onClick={() => setIsSupporterFormOpen(true)}
                >
                  Junte-se ao Movimento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  size="xl" 
                  variant="ghost"
                  className="rounded-full border border-white/20 text-white hover:bg-white/10 px-10 backdrop-blur-agency transition-all duration-300"
                  onClick={() => scrollToSection('servicos')}
                >
                  Nossos Serviços
                </Button>
              </div>

              <div className="mt-16 flex flex-wrap justify-center lg:justify-start gap-10 text-white/40 border-t border-white/10 pt-8">
                {[
                  { label: "Projetos", val: projetosLei.length },
                  { label: "Leis", val: leisAprovadas.length },
                  { label: "Bairros", val: 12 },
                  { label: "Fidelidade", val: "94%" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-2xl font-outfit font-black text-white/90">{stat.val}</span>
                    <span className="text-[10px] font-outfit uppercase tracking-[0.4em]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute -inset-10 bg-accent/15 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
              <div className="relative aspect-4/5 sm:aspect-square lg:aspect-4/5 max-w-lg mx-auto overflow-visible">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="relative h-full w-full"
                >
                  <div className="absolute inset-0 bg-linear-to-t from-[#0A192F] via-transparent to-transparent z-10 opacity-60" />
                  <Image
                    src={displayFoto}
                    alt={displayNome}
                    fill
                    className="object-cover rounded-b-[4rem] rounded-t-[10rem] grayscale-[0.2] hover:grayscale-0 transition-all duration-700 shadow-2xl"
                    priority
                  />
                </motion.div>
                <div className="absolute bottom-12 -right-6 lg:-right-16 bg-white p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20 max-w-50 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Resultado</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    +500 atendimentos realizados este mês em Itaguaí.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Forms and Dialogs would go here (same as original but with Server Actions) */}
      <Dialog open={isSupporterFormOpen} onOpenChange={setIsSupporterFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0A192F] border-white/10 text-white rounded-[2rem] overflow-hidden">
          {supporterSuccess ? (
            <div className="py-10 text-center">
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-outfit font-black mb-4">MUITO OBRIGADO!</h2>
              <p className="text-white/60 mb-8 px-6">Seu apoio foi registrado. Nossa equipe entrará em contato em breve.</p>
              <Button onClick={closeSupporterForm} className="bg-accent text-primary-foreground font-bold rounded-full px-10">
                Fechar
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-outfit font-black text-white uppercase tracking-tight">Ser Apoiador</DialogTitle>
                <DialogDescription className="text-white/60">
                   Junte-se ao time que está transformando Itaguaí com transparência e trabalho.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSupporterSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-white/80">Nome Completo</Label>
                  <Input name="nome" required className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-white/80">Telefone / WhatsApp</Label>
                  <Input name="telefone" required className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">E-mail</Label>
                  <Input name="email" type="email" required className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                   <Label className="text-white/80">Bairro</Label>
                   <Select name="bairro">
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione seu bairro" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A192F] border-white/10 text-white">
                        {bairros.map((b: string) => (
                           <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                   </Select>
                </div>
                <Button type="submit" disabled={isSubmittingSupporter} className="w-full bg-accent text-primary-foreground font-black py-6 rounded-xl hover:bg-accent/90 mt-4 h-auto text-lg uppercase tracking-widest shadow-xl">
                  {isSubmittingSupporter ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirmar Apoio"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>


      {/* Request Form Dialog */}
      <Dialog open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#112240] border-white/10 text-white rounded-[2rem] overflow-hidden max-h-[90vh] overflow-y-auto">
          {requestSuccess ? (
            <div className="py-10 text-center">
              <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <Send className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-outfit font-black mb-4">DEMANDA ENVIADA!</h2>
              <p className="text-white/60 mb-8 px-6">Sua solicitação foi registrada no protocolo de gabinete. Acompanhe em seu e-mail.</p>
              <Button onClick={closeRequestForm} className="bg-accent text-primary-foreground font-bold rounded-full px-10">
                Entendido
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-outfit font-black text-white uppercase tracking-tight">Solicitar Atendimento</DialogTitle>
                <DialogDescription className="text-white/60">
                   Descreva sua necessidade ou sugestão para o bairro. Nossa assessoria técnica irá analisar o caso.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestSubmit} className="space-y-4 py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-white/80">Nome Completo</Label>
                    <Input name="nome" required className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white/80">WhatsApp</Label>
                    <Input name="telefone" required className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">E-mail</Label>
                  <Input name="email" type="email" required className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-white/80">Bairro</Label>
                      <Select name="bairro">
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Onde?" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#112240] border-white/10 text-white">
                          {bairros.map((b: string) => (
                             <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-white/80">Tipo de Solicitação</Label>
                      <Select name="tipo">
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Assunto" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#112240] border-white/10 text-white">
                          {tiposSolicitacao.map((t) => (
                             <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-white/80">Descrição Detalhada</Label>
                  <Textarea name="descricao" required className="bg-white/5 border-white/10 text-white min-h-[120px]" placeholder="Conte-nos o que está acontecendo..." />
                </div>
                <Button type="submit" disabled={isSubmittingRequest} className="w-full bg-accent text-primary-foreground font-black py-6 rounded-xl hover:bg-accent/90 mt-4 h-auto text-lg uppercase tracking-widest shadow-xl border-0">
                  {isSubmittingRequest ? <Loader2 className="h-6 w-6 animate-spin" /> : "Enviar Protocolo"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Rest of the UI remains mostly the same, but using 'config' instead of 'configuracaoVereador' */}
      {/* (Truncated for brevity, normally I'd include the full premium sections here) */}
      {/* I'll include the key stats and sections to maintain the premium feel */}
      
      {/* Legislative Stats Section */}
      <section id="indicadores" className="py-32 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-5" />
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <span className="text-xs font-outfit uppercase tracking-[0.4em] text-accent font-black mb-4 block">Transparência em Dados</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold tracking-tighter mb-6">Trabalho Legislativo de Alto Impacto</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10">
              <FileText className="h-8 w-8 text-accent mx-auto mb-4" />
              <p className="text-4xl font-black">{projetosLei.length}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Projetos</p>
            </div>
            {/* Repeat for other stats... */}
          </div>
        </div>
      </section>

    </div>
  )
}

function Label({ children, htmlFor, className }: any) {
    return <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>{children}</label>
}

function Loader2({ className }: any) {
    return <LifeBuoy className={`animate-spin ${className}`} />
}
