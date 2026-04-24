"use client"

import React, { useState } from "react"
import {
  BarChart3, Calendar, Users, TrendingUp, Settings, Palette, Image,
  HelpCircle, Sparkles, Star, Crown, Lock, Activity, ArrowRight,
  Search, Filter
} from "lucide-react"
import type { ArvoreSegmento } from "@/src/arvores-segmentos/types"
import type { DesignTheme } from "@/src/themes/types"

interface Props {
  arvore: ArvoreSegmento
  theme: DesignTheme
  showPro?: boolean
}

const ICON_MAP: Record<string, React.ElementType> = {
  calendar: Calendar,
  users: Users,
  chart: BarChart3,
  trending: TrendingUp,
  star: Star,
  activity: Activity,
}

export function TemplateDashboardPreview({ arvore, theme, showPro = false }: Props) {
  const accent = theme.colors.light.accent
  const bgMain = "#fafaf9"
  const bgSidebar = "#0c0a09"

  const [activeTab, setActiveTab] = useState("Dashboard")

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard" },
    { icon: Calendar, label: "Agenda" },
    { icon: Users, label: "Clientes" },
    { icon: Image, label: "Editar Site" },
    { icon: Palette, label: "Tema" },
    { icon: HelpCircle, label: "FAQ" },
    { icon: Settings, label: "Configurações" },
  ]

  // Add Pro modules from niche tree
  const proModules = arvore.modulosEspeciais.filter((m) => m.pro)

  // Dashboard widgets from niche JSON
  const widgets = arvore.dashboardWidgets || []

  // Mock stats
  const stats = [
    { label: "Agendamentos", value: "127", delta: "+12%", icon: Calendar },
    { label: "Clientes", value: "89", delta: "+5%", icon: Users },
    { label: "Receita", value: "R$ 8.450", delta: "+18%", icon: TrendingUp },
    { label: "Avaliação", value: "4.9", delta: "★", icon: Star },
  ]

  return (
    <div
      className="flex overflow-hidden text-sm"
      style={{ borderRadius: theme.spacing.borderRadius, height: "100%" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="w-48 shrink-0 flex flex-col py-4 px-3 border-r"
        style={{ backgroundColor: bgSidebar, borderColor: "#292524" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-6">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ backgroundColor: accent }}
          >
            {arvore.meta.emoji}
          </div>
          <div>
            <p className="text-[10px] font-bold text-white truncate">{arvore.meta.nome}</p>
            <p className="text-[7px] text-stone-500 font-medium">Painel Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[10px] font-medium transition-all"
              style={{
                backgroundColor: activeTab === item.label ? `${accent}15` : "transparent",
                color: activeTab === item.label ? accent : "#a8a29e",
              }}
            >
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </button>
          ))}

          {/* Pro modules divider */}
          {proModules.length > 0 && (
            <>
              <div className="pt-3 pb-1 px-2">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-stone-600 flex items-center gap-1">
                  <Crown className="h-2.5 w-2.5" /> Módulos Pro
                </p>
              </div>
              {proModules.map((mod) => (
                <button
                  key={mod.type}
                  onClick={() => showPro && setActiveTab(mod.label)}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[10px] font-medium transition-all"
                  style={{
                    backgroundColor: activeTab === mod.label ? `${accent}15` : "transparent",
                    color: activeTab === mod.label ? accent : (showPro ? "#a8a29e" : "#44403c"),
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {showPro ? (
                      <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: activeTab === mod.label ? accent : "#a8a29e" }} />
                    ) : (
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{mod.label}</span>
                  </div>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Plan badge */}
        <div
          className="mt-auto mx-1 p-2.5 rounded-xl border text-center"
          style={{
            borderColor: showPro ? accent : "#292524",
            backgroundColor: showPro ? `${accent}10` : "#1c1917",
          }}
        >
          <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: showPro ? accent : "#78716c" }}>
            {showPro ? "Plano Premium" : "Plano Free"}
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-5 overflow-y-auto" style={{ backgroundColor: bgMain, color: "#1c1917" }}>
        
        {activeTab === "Dashboard" && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-stone-900" style={{ fontFamily: theme.cssVariables["--theme-font-heading"] }}>
              Dashboard
            </h2>
            <p className="text-[10px] text-stone-500">Visão geral do seu negócio</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-medium text-stone-500">Hoje, {new Date().toLocaleDateString("pt-BR")}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-3 border bg-white"
              style={{ borderRadius: theme.cards.borderRadius, borderColor: "#e7e5e4" }}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-3.5 w-3.5" style={{ color: accent }} />
                <span className="text-[8px] font-bold" style={{ color: accent }}>
                  {stat.delta}
                </span>
              </div>
              <p className="text-lg font-bold text-stone-900">{stat.value}</p>
              <p className="text-[8px] text-stone-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Niche-specific widgets */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {widgets.map((widget, i) => {
            const WidgetIcon = ICON_MAP[widget.icon] || Activity
            return (
              <div
                key={i}
                className="p-4 border bg-white flex items-start gap-3"
                style={{ borderRadius: theme.cards.borderRadius, borderColor: "#e7e5e4" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accent}15` }}
                >
                  <WidgetIcon className="h-4 w-4" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-stone-900">{widget.label}</p>
                  <p className="text-[9px] text-stone-500 mt-0.5">{widget.descricao}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pro Section */}
        {arvore.funcionalidadesPro && arvore.funcionalidadesPro.length > 0 && (
          <div className="mt-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 flex items-center gap-1">
              <Crown className="h-3 w-3" /> Funcionalidades Pro
            </p>
            <div className="grid grid-cols-2 gap-2">
              {arvore.funcionalidadesPro.map((sec) => (
                <div
                  key={sec.id}
                  className="p-3 border flex items-center gap-2"
                  style={{
                    borderRadius: theme.cards.borderRadius,
                    borderColor: showPro ? accent : "#e7e5e4",
                    backgroundColor: showPro ? `${accent}05` : "#fafaf9",
                    opacity: showPro ? 1 : 0.5,
                  }}
                >
                  {showPro ? (
                    <Sparkles className="h-3 w-3 shrink-0" style={{ color: accent }} />
                  ) : (
                    <Lock className="h-3 w-3 shrink-0 text-stone-400" />
                  )}
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: showPro ? accent : "#78716c" }}>
                      {sec.nome}
                    </p>
                    <p className="text-[8px] text-stone-500">{sec.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        )}

        {/* --- Other Tabs --- */}
        {activeTab !== "Dashboard" && (
          <div className="h-full flex flex-col pt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: "#0c0a09" }}>{activeTab}</h2>
                <p className="text-[11px] text-stone-500">
                  Gerenciamento de {activeTab.toLowerCase()} para {arvore.meta.nome}.
                </p>
              </div>
              <button 
                className="px-3 py-1.5 text-[10px] font-bold text-white shadow shadow-black/5 flex items-center gap-1.5 transition-opacity hover:opacity-90"
                style={{ backgroundColor: accent, borderRadius: theme.cssVariables["--theme-btn-radius"] }}
              >
                + Novo Registro
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-white border" style={{ borderColor: "#e7e5e4", borderRadius: theme.cards.borderRadius }}>
              {activeTab === "Agenda" && <AgendaMock theme={theme} accent={accent} />}
              {activeTab === "Clientes" && <ClientesMock theme={theme} accent={accent} />}
              {(activeTab === "Editar Site" || activeTab === "Tema") && <EditorMock theme={theme} accent={accent} tab={activeTab} />}
              {(activeTab === "Configurações" || activeTab === "FAQ") && <ConfigMock theme={theme} accent={accent} tab={activeTab} />}
              {proModules.some(m => m.label === activeTab) && <ProModuleMock theme={theme} accent={accent} moduleName={activeTab} />}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ── Mocks Internal Components ──

function AgendaMock({ theme, accent }: { theme: DesignTheme, accent: string }) {
  const hours = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]
  const appointments = [
    { time: 1, span: 2, title: "Corte + Tratamento", client: "Mariana Silva", color: accent },
    { time: 4, span: 1, title: "Sessão Básica", client: "Juliana Costa", color: "#3b82f6" },
    { time: 6, span: 1.5, title: "Procedimento Vip", client: "Fernanda Lima", color: "#ec4899" },
  ]
  
  return (
    <div className="flex bg-stone-50 h-[500px]">
      <div className="w-16 flex flex-col border-r bg-white" style={{ borderColor: "#e7e5e4" }}>
        {hours.map((h, i) => (
          <div key={i} className="flex-1 flex items-start justify-center pt-2 text-[9px] font-bold text-stone-400 border-b border-stone-100">{h}</div>
        ))}
      </div>
      <div className="flex-1 relative bg-white bg-[linear-gradient(to_bottom,#f5f5f4_1px,transparent_1px)]" style={{ backgroundSize: '100% 60px' }}>
         {appointments.map((apt, i) => (
           <div 
             key={i} 
             className="absolute left-2 right-4 p-2.5 rounded-lg border border-black/5 flex flex-col justify-between overflow-hidden shadow-sm"
             style={{
               top: `${apt.time * 60 + 8}px`,
               height: `${apt.span * 60 - 16}px`,
               backgroundColor: `${apt.color}15`,
               borderLeft: `3px solid ${apt.color}`,
               borderRadius: theme.cards.borderRadius
             }}
           >
             <div>
                <p className="text-[10px] font-bold leading-none text-stone-800 mb-1">{apt.title}</p>
                <p className="text-[8px] font-medium text-stone-500">{apt.client}</p>
             </div>
             {apt.span > 1 && (
               <div className="flex -space-x-1">
                 <div className="w-4 h-4 rounded-full bg-white border border-stone-200"></div>
                 <div className="w-4 h-4 rounded-full bg-stone-100 border border-stone-200"></div>
               </div>
             )}
           </div>
         ))}
      </div>
    </div>
  )
}

function ClientesMock({ theme, accent }: { theme: DesignTheme, accent: string }) {
  const clients = [
    { name: "Mariana Silva", phone: "(21) 99999-1111", lastVisit: "Hoje", status: "Confirmado", spent: "R$ 450" },
    { name: "Juliana Costa", phone: "(21) 98888-2222", lastVisit: "Há 2 dias", status: "Concluído", spent: "R$ 1.200" },
    { name: "Fernanda Lima", phone: "(21) 97777-3333", lastVisit: "Há 1 semana", status: "Ausente", spent: "R$ 890" },
    { name: "Roberta Alves", phone: "(21) 96666-4444", lastVisit: "Há 1 mês", status: "Concluído", spent: "R$ 3.450" },
    { name: "Renata Gomes", phone: "(21) 95555-5555", lastVisit: "Há 2 meses", status: "Cancelado", spent: "R$ 120" },
  ]

  return (
    <div className="flex flex-col h-[500px] bg-white">
      <div className="p-3 border-b flex items-center justify-between bg-stone-50" style={{ borderColor: "#e7e5e4" }}>
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-8 pr-3 py-1.5 text-[10px] border border-stone-200 rounded-md bg-white outline-none w-56 focus:border-stone-300"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] border rounded-md font-medium text-stone-600 bg-white shadow-sm hover:bg-stone-50">
          <Filter className="h-3 w-3" /> Filtrar Lista
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-stone-50/50 text-[9px] uppercase tracking-wider text-stone-500" style={{ borderColor: "#e7e5e4" }}>
              <th className="font-bold py-3 px-4">Cliente</th>
              <th className="font-bold py-3 px-4">Contato</th>
              <th className="font-bold py-3 px-4">Última Visita</th>
              <th className="font-bold py-3 px-4 text-right">LTV</th>
              <th className="font-bold py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {clients.map((c, i) => (
              <tr key={i} className="border-b hover:bg-stone-50 transition-colors" style={{ borderColor: "#f5f5f4" }}>
                <td className="py-2.5 px-4 font-bold text-stone-800 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white" style={{ backgroundColor: accent }}>
                    {c.name.charAt(0)}
                  </div>
                  {c.name}
                </td>
                <td className="py-2.5 px-4 text-stone-600 font-mono text-[9px]">{c.phone}</td>
                <td className="py-2.5 px-4 text-stone-600 font-medium">{c.lastVisit}</td>
                <td className="py-2.5 px-4 text-stone-800 font-black text-right">{c.spent}</td>
                <td className="py-2.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${
                    c.status === 'Confirmado' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                    c.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EditorMock({ theme, accent, tab }: { theme: DesignTheme, accent: string, tab: string }) {
  return (
    <div className="flex h-[500px]">
      <div className="w-64 border-r bg-stone-50 p-4 overflow-y-auto" style={{ borderColor: "#e7e5e4" }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-4 flex items-center justify-between">
          {tab === 'Tema' ? 'Estilo Visual' : 'Construtor Web'}
          <Settings className="h-3 w-3" />
        </p>
        
        <div className="space-y-4">
          <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-sm">
             <p className="text-[11px] font-bold text-stone-800 mb-2">Painel de Configuração</p>
             <div className="h-1.5 w-3/4 bg-stone-100 rounded-full mb-2" />
             <div className="h-1.5 w-1/2 bg-stone-100 rounded-full mb-4" />
             <button className="w-full py-1.5 rounded-md text-[10px] font-bold text-white transition-opacity hover:opacity-90 shadow-lg shadow-black/10" style={{ backgroundColor: accent }}>Atualizar Site</button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i =>(
              <div key={i} className="aspect-square bg-white border border-stone-200 rounded-lg flex flex-col items-center justify-center p-2 hover:border-stone-400 transition-colors cursor-pointer text-stone-400">
                <Image className="h-4 w-4 mb-2" />
                <div className="h-1 w-8 bg-stone-200 rounded-full"/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-stone-200 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] p-6 flex items-center justify-center relative overflow-hidden" style={{ backgroundSize: '16px 16px' }}>
        <div className="w-[320px] h-[550px] bg-white rounded-[2rem] shadow-2xl overflow-hidden relative scale-[0.75] origin-top border-[6px] border-stone-900 flex flex-col">
          <div className="h-32 bg-stone-100 flex items-center justify-center p-4" style={{ backgroundColor: `${accent}20` }}>
             <div className="text-2xl font-bold opacity-80" style={{ color: accent, fontFamily: theme.cssVariables['--theme-font-heading'] }}>MockView</div>
          </div>
          <div className="p-5 flex-1 space-y-4">
             <div className="h-3 w-1/2 bg-stone-200 rounded-full" />
             <div className="space-y-2">
               <div className="h-2 w-full bg-stone-100 rounded-full" />
               <div className="h-2 w-full bg-stone-100 rounded-full" />
               <div className="h-2 w-3/4 bg-stone-100 rounded-full" />
             </div>
             <div className="pt-4 grid grid-cols-2 gap-3">
                <div className="aspect-square bg-stone-50 rounded-xl border-2 border-stone-100 border-dashed" />
                <div className="aspect-square bg-stone-50 rounded-xl border-2 border-stone-100 border-dashed" />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigMock({ theme, accent, tab }: { theme: DesignTheme, accent: string, tab: string }) {
  return (
    <div className="p-6 h-[500px] bg-stone-50/30 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 border rounded-xl bg-white shadow-sm space-y-5" style={{ borderColor: "#e7e5e4", borderRadius: theme.cards.borderRadius }}>
          <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
             <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
               <Settings className="h-4 w-4" style={{ color: accent }} />
             </div>
             <div>
               <h3 className="text-sm font-bold text-stone-800">{tab === 'FAQ' ? 'Cadastro de Dúvidas (FAQ)' : 'Informações do Estabelecimento'}</h3>
               <p className="text-[10px] text-stone-500 font-medium mt-0.5">Preencha os dados e gerencie a visibilidade na página.</p>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Título / Pergunta Principal</label>
              <input type="text" className="w-full border border-stone-200 rounded-md px-3 py-2 text-xs bg-white focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400" defaultValue={tab === 'FAQ' ? "Como funciona o agendamento?" : "Nome Público na Internet"} />
            </div>
            {tab !== 'FAQ' && (
              <>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">WhatsApp / Celular</label>
                  <input type="text" className="w-full border border-stone-200 rounded-md px-3 py-2 text-xs bg-white" defaultValue="(21) 99999-9999" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">E-mail de Contato</label>
                  <input type="email" className="w-full border border-stone-200 rounded-md px-3 py-2 text-xs bg-white" defaultValue="contato@negocio.com" />
                </div>
              </>
            )}
            <div className="col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">Descrição / Resposta Detalhada</label>
              <textarea className="w-full border border-stone-200 rounded-md px-3 py-2 text-xs bg-white h-24 focus:outline-none focus:border-stone-400" defaultValue="Edite as informações para melhor refletir os serviços do seu estabelecimento. Os dados salvos aqui serão utilizados globalmente em todo o site." />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2 border-t border-stone-100 mt-2">
            <button className="px-4 py-2 text-[10px] font-bold text-stone-600 rounded-md hover:bg-stone-100">Descartar</button>
            <button className="px-5 py-2 text-[10px] font-bold text-white rounded-md shadow flex items-center gap-1.5 transition-opacity hover:opacity-90" style={{ backgroundColor: accent, borderRadius: theme.cssVariables["--theme-btn-radius"] }}>
               Salvar {tab}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProModuleMock({ theme, accent, moduleName }: { theme: DesignTheme, accent: string, moduleName: string }) {
  return (
    <div className="p-6 h-[500px] space-y-5 bg-stone-50">
      <div className="flex flex-col gap-1 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 w-fit">
          <Crown className="h-3 w-3" /> Exclusivo Pro
        </div>
        <h3 className="text-xl font-black text-stone-900 mt-1">{moduleName}</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[
          { v: '87%', l: 'Taxa Crescimento'}, 
          { v: '1.2k', l: 'Interações Globais' }, 
          { v: '+R$4k', l: 'Impacto Estimado' }
        ].map((item, i) => (
          <div key={i} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col justify-center" style={{ borderColor: "#e7e5e4", borderRadius: theme.cards.borderRadius }}>
            <TrendingUp className="h-4 w-4 mb-3 opacity-60" style={{ color: accent }} />
            <span className="text-2xl font-black text-stone-800 tracking-tight">{item.v}</span>
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">{item.l}</span>
          </div>
        ))}
      </div>
      
      <div className="h-56 mt-6 border rounded-xl bg-white flex flex-col overflow-hidden relative shadow-sm" style={{ borderColor: "#e7e5e4", borderRadius: theme.cards.borderRadius }}>
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <p className="text-xs font-bold text-stone-800">Crescimento Mensal</p>
          <button className="text-[10px] font-medium text-stone-500 flex items-center gap-1">Últimos 30 Dias</button>
        </div>
        <div className="flex-1 flex items-end gap-2 px-6 pt-4 pb-0 bg-[linear-gradient(to_bottom,transparent_1px,#f5f5f4_1px)] bg-[size:100%_25px]">
           {/* Mock bars */}
           {[30, 45, 25, 60, 80, 50, 90, 75, 100, 65, 85].map((val, idx) => (
             <div 
               key={idx} 
               className="flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-all cursor-crosshair"
               style={{ height: `${val}%`, backgroundColor: accent }}
             />
           ))}
        </div>
      </div>
    </div>
  )
}
