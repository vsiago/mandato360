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
  Facebook,
  Heart,
  FileText,
  Scale,
  ChevronRight,
  Users,
  MessageSquare,
  Instagram,
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
import {
  configuracaoVereador,
  projetosLei,
  leisAprovadas,
  publicacoes,
  indicacoes,
  bairros,
} from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

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

export default function LandingPageVereador() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Supporter form state
  const [isSupporterFormOpen, setIsSupporterFormOpen] = useState(false)
  const [supporterSuccess, setSupporterSuccess] = useState(false)
  const [supporterData, setSupporterData] = useState({
    nome: '',
    telefone: '',
    email: '',
    bairro: '',
  })

  // Request form state
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [requestData, setRequestData] = useState({
    nome: '',
    telefone: '',
    email: '',
    bairro: '',
    tipo: '',
    descricao: '',
  })

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

  const handleSupporterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create a new citizen with "Apoiador" status in the CRM
    setSupporterSuccess(true)
    setSupporterData({ nome: '', telefone: '', email: '', bairro: '' })
  }

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would create a new demand in "Demandas da Populacao"
    setRequestSuccess(true)
    setRequestData({ nome: '', telefone: '', email: '', bairro: '', tipo: '', descricao: '' })
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
    <div className="min-h-screen bg-background">
      {/* Floating Header - Agency Style */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-7xl rounded-full border border-white/10 ${
        isScrolled ? "bg-[#0A192F]/90 backdrop-blur-agency shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-3 px-2" : "bg-transparent py-4 px-2"
      }`}>
        <div className="mx-auto px-6 md:px-12">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo/Name */}
            <Link href="/vereador" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary-foreground font-bold shadow-lg">
                {configuracaoVereador.nome.charAt(0)}
              </div>
              <span className="font-outfit font-black text-sm md:text-lg text-white uppercase tracking-tight">
                {configuracaoVereador.nome.split(' (')[0]}
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

      {/* Hero Section - Exceptional Redesign */}
      <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-[#0A192F]">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0A192F] via-[#112240] to-[#0A192F]" />
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 bg-grain pointer-events-none" />

        {/* Dynamic Pattern */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23ffffff' stroke-width='1' fill='none' opacity='0.2' /%3E%3C/svg%3E")`,
          }} 
        />

        {/* Abstract Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10 pt-44 lg:pt-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Content Side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm shadow-2xl"
              >
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-outfit uppercase tracking-[0.3em] text-white/70 italic">
                  Mandato Participativo / Itaguaí
                </span>
              </motion.div>

              <h1 className="text-5xl font-outfit font-extrabold text-white leading-[1.1] tracking-tighter sm:text-7xl lg:text-7xl mb-8 max-w-4xl">
                A voz de <span className="text-accent underline decoration-white/20 underline-offset-8">Itaguaí</span> na Câmara.
              </h1>
              
              <div className="h-1 w-20 bg-accent mb-8 mx-auto lg:mx-0" />

              <p className="text-xl font-outfit text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
                Liderança, transparência e compromisso real. {configuracaoVereador.nome.split(' (')[0]} está transformando o mandato legislativo em um centro de resultados para nossa gente.
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


            {/* Visual Side: The "Cutout" Experience */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative group"
            >
              {/* Background Accent Geometry */}
              <div className="absolute -inset-10 bg-accent/15 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
              
              <div className="relative aspect-4/5 sm:aspect-square lg:aspect-4/5 max-w-lg mx-auto overflow-visible">
                {/* Image Placeholder with Agency Feel */}
                <motion.div 
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative h-full w-full"
                >
                  <div className="absolute inset-0 bg-linear-to-t from-[#0A192F] via-transparent to-transparent z-10 opacity-60" />
                  <Image
                    src={configuracaoVereador.foto}
                    alt={configuracaoVereador.nome}
                    fill
                    className="object-cover rounded-b-[4rem] rounded-t-[10rem] grayscale-[0.2] hover:grayscale-0 transition-all duration-700 shadow-2xl"
                    priority
                  />
                </motion.div>

                {/* Overlapping Info Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-12 -right-6 lg:-right-16 bg-white p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20 max-w-50 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">Resultado</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    +500 atendimentos realizados este mês em Itaguaí.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      <section id="servicos" className="py-32 bg-white relative overflow-hidden">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/2 -skew-x-12 transform translate-x-1/2" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-outfit uppercase tracking-[0.4em] text-accent font-black mb-4 block">
                Expertise & Atendimento
              </span>
              <h2 className="text-4xl md:text-6xl font-outfit font-extrabold tracking-tighter text-slate-900 mb-6">
                Serviços de Excelência para Itaguaí
              </h2>
              <div className="h-1.5 w-24 bg-accent mx-auto mb-8" />
              <p className="text-xl text-slate-500 font-outfit leading-relaxed max-w-2xl mx-auto">
                Nosso gabinete opera como um centro de inteligência cidadã, oferecendo suporte técnico e jurídico especializado para toda a população.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              { 
                title: "Blindagem Jurídica", 
                desc: "Defesa técnica de direitos sociais e civis. Orientação jurídica de alto nível para quem mais precisa.",
                icon: Scale
              },
              { 
                title: "Gabinete de Campo", 
                desc: "Presença estratégica em todos os distritos. Registramos demandas reais com geolocalização e urgência.",
                icon: MapPin
              },
              { 
                title: "Fiscalização Digital", 
                desc: "Plataforma integrada para auditoria do dinheiro público. Transparência radical em tempo real.",
                icon: Heart
              }
            ].map(({ icon: Icon, ...servico }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <Card className="group relative overflow-hidden border-0 bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-[2.5rem] p-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-[4rem] transition-all duration-500 group-hover:scale-150 group-hover:bg-accent/10" />
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-[#0A192F] text-accent flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-outfit font-black mb-4 text-slate-900 uppercase tracking-tight">{servico.title}</h3>
                    <p className="text-slate-500 font-outfit leading-relaxed text-lg">
                      {servico.desc}
                    </p>
                    <div className="mt-8 flex items-center text-accent font-outfit text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Saiba mais <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Section - Agency Premium */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="overflow-hidden border border-white/10 bg-[#0A192F] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] rounded-[3rem] relative">
              <div className="absolute inset-0 bg-grain opacity-5" />
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
              
              <div className="grid lg:grid-cols-5 relative z-10">
                {/* Left side - Insightful Content */}
                <div className="lg:col-span-3 p-10 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-10 rotate-3">
                    <LifeBuoy className="h-7 w-7 text-accent" />
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mb-8 tracking-tighter leading-tight uppercase">
                    Precisa de <span className="text-accent underline decoration-white/10 italic">Ajuda?</span>
                  </h2>
                  
                  <p className="text-white/60 font-outfit text-xl mb-12 max-w-xl leading-relaxed">
                    Sua voz é a nossa prioridade. Envie sua solicitação ou sugestão diretamente ao gabinete técnico para análise e encaminhamento imediato.
                  </p>
                  
                  <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-11 w-11 rounded-full border-2 border-[#0A192F] bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl`}>
                           <div className={`h-full w-full bg-linear-to-br ${i % 2 === 0 ? 'from-accent to-orange-500' : 'from-blue-500 to-indigo-600'} opacity-80`} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-white font-outfit font-black text-xl">+500</p>
                      <p className="text-white/40 font-outfit text-[10px] uppercase tracking-widest">Protocolos Atendidos</p>
                    </div>
                  </div>
                </div>

                {/* Right side - Decisive CTA */}
                <div className="lg:col-span-2 p-10 md:p-16 flex flex-col justify-center items-center text-center bg-white/5 backdrop-blur-sm">
                  <div className="p-6 bg-white/5 rounded-full mb-8 relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                    <Send className="h-10 w-10 text-accent relative z-10" />
                  </div>
                  
                  <h3 className="text-2xl font-outfit font-black text-white mb-4 uppercase tracking-tighter">
                    Fale com o Gabinete
                  </h3>
                  <p className="text-white/50 font-outfit mb-10 max-w-xs text-lg">
                    Agilize seu atendimento através da nossa plataforma digital de demandas públicas.
                  </p>
                  
                  <Button 
                    size="xl"
                    className="w-full rounded-2xl bg-linear-to-r from-accent to-orange-500 hover:to-orange-600 border-0 text-primary-foreground font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:shadow-[0_25px_60px_rgba(245,158,11,0.4)] transition-all duration-500 hover:-translate-y-1"
                    onClick={() => setIsRequestFormOpen(true)}
                  >
                    Enviar Solicitação
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                  
                  <p className="mt-8 text-white/20 font-outfit text-[10px] uppercase tracking-widest italic">
                    Resposta média em até 48 horas úteis.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Historia Section - Agency Style */}
      <section id="historia" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-outfit uppercase tracking-[0.4em] text-accent font-black mb-4 block">A Trajetória</span>
              <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tighter">
                Conheça o Vereador {configuracaoVereador.nome.split(' (')[0]}
              </h2>
              <div className="h-1 w-20 bg-accent mx-auto" />
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-4/5 relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src={configuracaoVereador.foto}
                  alt={configuracaoVereador.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-10 -right-10 bg-[#0A192F] text-white p-10 rounded-[2.5rem] shadow-2xl border border-white/10"
              >
                <p className="text-5xl font-outfit font-black text-accent">8+</p>
                <p className="text-xs font-outfit uppercase tracking-widest text-white/60">Anos de Mandato</p>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-outfit font-black text-slate-900 mb-8 leading-tight">
                Uma vida dedicada ao serviço público e à justiça social em Itaguaí.
              </h3>
              <div className="space-y-6 text-lg text-slate-600 font-outfit leading-relaxed">
                <p>{configuracaoVereador.biografia}</p>
                <p>
                  Acreditamos que a política deve ser feita olho no olho, com transparência radical e foco absoluto em trazer dignidade para quem mais precisa.
                </p>
              </div>
              
              <div className="mt-12">
                <Button variant="link" className="text-accent p-0 font-bold hover:no-underline group">
                  Ver histórico completo <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legislative Stats - Premium Grid */}
      <section id="indicadores" className="py-32 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-5" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <span className="text-xs font-outfit uppercase tracking-[0.4em] text-accent font-black mb-4 block">Transparência em Dados</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold tracking-tighter mb-6">Trabalho Legislativo de Alto Impacto</h2>
            <p className="text-white/60 font-outfit text-lg">Número reais de um mandato que não para de crescer.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { label: "Projetos de Lei", val: projetosLei.length, icon: FileText, color: "text-accent" },
              { label: "Leis Aprovadas", val: leisAprovadas.length, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Famílias Apoiadas", val: 512, icon: Users, color: "text-blue-400" },
              { label: "Indicações", val: indicacoes.length, icon: TrendingUp, color: "text-purple-400" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 bg-white/5 backdrop-blur-agency shadow-2xl rounded-4xl p-2 hover:bg-white/10 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className={`h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 ${stat.color} shadow-inner`}>
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <p className="text-4xl font-outfit font-black mb-2 text-white">{stat.val}</p>
                    <p className="text-xs font-outfit uppercase tracking-widest text-white/60">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projetos de Lei Section */}
      <section id="projetos" className="py-20 bg-muted/30">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              Trabalho Legislativo
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Projetos de Lei
            </h2>
            <p className="text-muted-foreground">
              Confira os projetos que estamos trabalhando para melhorar nossa cidade
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {projetosLei.map((projeto) => (
              <Card key={projeto.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {projeto.numero}
                    </span>
                    <Badge
                      className={
                        projeto.status === 'aprovado'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50'
                          : projeto.status === 'tramitando'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-50'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {projeto.status === 'aprovado' ? 'Aprovado' : projeto.status === 'tramitando' ? 'Tramitando' : projeto.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{projeto.titulo}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{projeto.descricao}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(projeto.data)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leis Aprovadas Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">
              Conquistas do Mandato
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Leis Aprovadas
            </h2>
            <p className="text-muted-foreground">
              Leis que ja estao em vigor beneficiando a populacao
            </p>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            {leisAprovadas.map((lei) => (
              <Card key={lei.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <Scale className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                          {lei.numero}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(lei.data)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{lei.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{lei.descricao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimas Publicacoes - Executive Feed */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <span className="text-xs font-outfit uppercase tracking-[0.4em] text-accent font-black mb-4 block">Informativos</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold tracking-tighter text-slate-900 mb-6">Prestação de Contas em Tempo Real</h2>
            <div className="h-1.5 w-24 bg-accent mx-auto" />
          </div>
          
          <div className="grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
            {publicacoes.slice(0, 3).map((publicacao, i) => (
              <motion.div 
                key={publicacao.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group border-0 bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 overflow-hidden rounded-4xl">
                  <div className="aspect-16/10 relative bg-slate-200 overflow-hidden">
                    <Image
                      src={publicacao.imagem}
                      alt={publicacao.titulo}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-outfit font-black text-white uppercase tracking-widest border border-white/20">
                      {formatDate(publicacao.data)}
                    </div>
                  </div>
                  <CardContent className="p-10">
                    <h3 className="text-xl font-outfit font-black text-slate-900 mb-4 line-clamp-2 leading-tight uppercase tracking-tight">
                      {publicacao.titulo}
                    </h3>
                    <p className="text-slate-500 font-outfit leading-relaxed line-clamp-3 mb-8">
                      {publicacao.conteudo}
                    </p>
                    <Link href="#" className="inline-flex items-center text-xs font-outfit font-black text-accent uppercase tracking-widest group-hover:gap-3 transition-all">
                      Ler relatório <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Participe do Mandato - Power CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0A192F]">
        <div className="absolute inset-0 bg-grain opacity-5" />
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary via-primary to-accent opacity-90" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-8xl font-outfit font-black text-white mb-8 tracking-tighter">
              Faça a diferença em <span className="italic text-accent underline decoration-white/10">Itaguaí.</span>
            </h2>
            <p className="text-white/70 font-outfit text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Não somos apenas um mandato, somos um movimento pela dignidade itaguaiense. Junte-se a milhares de vozes que querem o melhor para nossa cidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="xl" 
                className="rounded-full bg-accent text-primary-foreground hover:bg-accent/90 px-12 shadow-[0_20px_50px_rgba(245,158,11,0.4)]"
                onClick={() => setIsSupporterFormOpen(true)}
              >
                <Heart className="mr-3 h-6 w-6" />
                Quero ser Voluntário
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10 px-12 backdrop-blur-agency"
                onClick={() => setIsRequestFormOpen(true)}
              >
                Minha Sugestão
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instagram - Premium Social Connection */}
      <section className="py-32 bg-white">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="h-24 w-24 rounded-4xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center mx-auto mb-10 shadow-2xl"
            >
              <Instagram className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-outfit font-black text-slate-900 mb-8 tracking-tight">
              @mandato360itaguai
            </h2>
            <p className="text-slate-500 font-outfit text-xl mb-12 max-w-2xl mx-auto">
              Acompanhe os bastidores do nosso trabalho, fiscalizações e o dia a dia de quem luta por você.
            </p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="xl" className="rounded-full bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 px-12 shadow-2xl text-white border-0">
                <Instagram className="mr-3 h-6 w-6" />
                Conectar no Instagram
                <ExternalLink className="ml-3 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20">
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
              Contato
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fale Conosco
            </h2>
            <p className="text-muted-foreground">
              Entre em contato com o gabinete do vereador
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Endereco</h3>
                <p className="text-sm text-muted-foreground">
                  Camara Municipal<br />
                  {configuracaoVereador.cidade}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Telefone</h3>
                <p className="text-sm text-muted-foreground">
                  (11) 3333-4444
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm text-center">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  gabinete@vereador.gov.br
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer - Agency Premium */}
      <footer className="bg-[#050C16] text-white pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-grain opacity-5" />
        
        <div className="mx-auto px-6 md:px-12 max-w-7xl relative z-10">
          <div className="grid gap-16 md:grid-cols-4 mb-20">
            {/* Identity Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-accent h-12 w-12 rounded-xl flex items-center justify-center font-outfit font-black text-primary">
                  {configuracaoVereador.nome.charAt(0)}
                </div>
                <div>
                  <h4 className="font-outfit font-black text-xl tracking-tight uppercase">{configuracaoVereador.nome.split(' (')[0]}</h4>
                  <p className="text-xs font-outfit uppercase tracking-[0.3em] text-white/40 italic">Mandato por Itaguaí</p>
                </div>
              </div>
              <p className="font-outfit text-white/50 leading-relaxed max-w-sm text-lg">
                Transformando a política através da transparência radical e do compromisso inabalável com o povo de Itaguaí.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-outfit font-bold text-sm uppercase tracking-widest text-accent mb-8">Navegação</h5>
              <ul className="space-y-4 font-outfit text-sm text-white/60">
                <li><Link href="#inicio" className="hover:text-white transition-colors">Início</Link></li>
                <li><Link href="#historia" className="hover:text-white transition-colors">História</Link></li>
                <li><Link href="#servicos" className="hover:text-white transition-colors">Serviços públicos</Link></li>
                <li><Link href="#projetos" className="hover:text-white transition-colors">Leis e Projetos</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="font-outfit font-bold text-sm uppercase tracking-widest text-accent mb-8">Contatos</h5>
              <div className="space-y-4 font-outfit text-sm text-white/60">
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-accent" />
                  (21) 3333-4444
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent" />
                  gabinete@vereador.gov.br
                </p>
                <div className="pt-4 flex gap-4">
                  <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-outfit text-white/30 tracking-widest uppercase">
              &copy; 2024 {configuracaoVereador.nome.split(' (')[0]}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs font-outfit text-white/30 tracking-widest uppercase italic">
              Desenvolvido com
              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-white/60 not-italic">
                Mandato360 Pro
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Supporter Form Dialog */}
      <Dialog open={isSupporterFormOpen} onOpenChange={closeSupporterForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {supporterSuccess ? 'Cadastro Realizado!' : 'Ser Apoiador'}
            </DialogTitle>
            <DialogDescription>
              {supporterSuccess 
                ? 'Obrigado por se juntar a nos!' 
                : 'Preencha seus dados para se tornar um apoiador'
              }
            </DialogDescription>
          </DialogHeader>

          {supporterSuccess ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Bem-vindo ao time!
              </h3>
              <p className="text-muted-foreground">
                Voce agora faz parte da nossa rede de apoiadores.
              </p>
              <Button className="mt-6" onClick={closeSupporterForm}>
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSupporterSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={supporterData.nome}
                    onChange={(e) => setSupporterData({ ...supporterData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={supporterData.telefone}
                    onChange={(e) => setSupporterData({ ...supporterData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={supporterData.email}
                    onChange={(e) => setSupporterData({ ...supporterData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <Select
                  value={supporterData.bairro}
                  onValueChange={(value) => setSupporterData({ ...supporterData, bairro: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione o bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {bairros.map((bairro) => (
                      <SelectItem key={bairro} value={bairro}>
                        {bairro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={closeSupporterForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Heart className="mr-2 h-4 w-4" />
                  Cadastrar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Form Dialog */}
      <Dialog open={isRequestFormOpen} onOpenChange={closeRequestForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {requestSuccess ? 'Solicitacao Enviada!' : 'Enviar Solicitacao'}
            </DialogTitle>
            <DialogDescription>
              {requestSuccess 
                ? 'Sua solicitacao foi recebida pelo gabinete' 
                : 'Preencha os dados para enviar sua solicitacao ao gabinete'
              }
            </DialogDescription>
          </DialogHeader>

          {requestSuccess ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Solicitacao registrada com sucesso!
              </h3>
              <p className="text-muted-foreground">
                Nossa equipe entrara em contato em breve.
              </p>
              <Button className="mt-6" onClick={closeRequestForm}>
                Fechar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={requestData.nome}
                    onChange={(e) => setRequestData({ ...requestData, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={requestData.telefone}
                      onChange={(e) => setRequestData({ ...requestData, telefone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={requestData.email}
                      onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">Bairro</label>
                  <Select
                    value={requestData.bairro}
                    onValueChange={(value) => setRequestData({ ...requestData, bairro: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o bairro" />
                    </SelectTrigger>
                    <SelectContent>
                      {bairros.map((bairro) => (
                        <SelectItem key={bairro} value={bairro}>
                          {bairro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Tipo de Solicitacao</label>
                  <Select
                    value={requestData.tipo}
                    onValueChange={(value) => setRequestData({ ...requestData, tipo: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposSolicitacao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Descricao da Solicitacao</label>
                <Textarea
                  value={requestData.descricao}
                  onChange={(e) => setRequestData({ ...requestData, descricao: e.target.value })}
                  placeholder="Descreva sua solicitacao em detalhes..."
                  className="mt-1"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={closeRequestForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitacao
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
