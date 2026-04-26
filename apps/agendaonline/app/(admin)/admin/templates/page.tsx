"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe, LayoutDashboard, Lock, Settings, LayoutTemplate,
  Sparkles, SlidersHorizontal, Eye, ChevronDown, Check,
  ExternalLink, History, Rocket, FlaskConical, Radio,
  Copy, Search, Palette, Save, RefreshCw, AlertTriangle
} from "lucide-react"
import { getAllNichos, getArvoreBySlug, type ArvoreSegmento } from "@/src/arvores-segmentos"
import { getAllThemes, getTheme, getDefaultThemeForNiche, type ThemeId } from "@/src/themes"
import { generateMockTenant } from "@/src/themes/mock-tenant"
import type { TenantConfig } from "@/lib/tenant-config"

import { TemplateSitePreview } from "@/components/admin/template-site-preview"
import { TemplateDashboardPreview } from "@/components/admin/template-dashboard-preview"
import { TemplateAuthPreview } from "@/components/admin/template-auth-preview"

import { Button } from "@/components/ui/button"

type TabId = "site" | "dashboard" | "auth" | "config" | "json" | "history"

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "site", label: "Site Preview", icon: Globe },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "auth", label: "Auth (White-label)", icon: Lock },
  { id: "config", label: "Configuração", icon: Settings },
  { id: "json", label: "JSON Inspector", icon: Eye, badge: "NEW" },
  { id: "history", label: "Histórico", icon: History, badge: "NEW" },
]

export default function TemplatesCockpit() {
  const niches = getAllNichos()
  const themes = getAllThemes()

  const [activeTab, setActiveTab] = useState<TabId>("site")
  const [selectedNiche, setSelectedNiche] = useState<string>("salao-de-beleza")
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("classico")
  const [isPro, setIsPro] = useState(false)

  // Environment toggle
  const [environment, setEnvironment] = useState<"lab" | "production">("lab")

  // Dropdowns
  const [nicheOpen, setNicheOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)

  // Live tenant config (fetched from API)
  const [liveConfig, setLiveConfig] = useState<TenantConfig | null>(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveSlug, setLiveSlug] = useState("")
  const [slugInput, setSlugInput] = useState("")

  // Save state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  // JSON search
  const [jsonSearch, setJsonSearch] = useState("")

  // Derived state
  const arvore = getArvoreBySlug(selectedNiche) || (getArvoreBySlug(niches[0].slug) as ArvoreSegmento)
  const currentTheme = getTheme(selectedTheme)
  const suggestedThemeId = getDefaultThemeForNiche(selectedNiche)
  const mockTenant = generateMockTenant(arvore, currentTheme)

  // Fetch live tenant config
  const fetchLiveConfig = useCallback(async (slug: string) => {
    if (!slug.trim()) return
    setLiveLoading(true)
    try {
      const res = await fetch(`/api/tenant-config/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setLiveConfig(data)
        setLiveSlug(slug)
      } else {
        setLiveConfig(null)
      }
    } catch {
      setLiveConfig(null)
    } finally {
      setLiveLoading(false)
    }
  }, [])

  // Handlers
  const handleNicheChange = (slug: string) => {
    setSelectedNiche(slug)
    setNicheOpen(false)
    setSelectedTheme(getDefaultThemeForNiche(slug))
  }

  const handleThemeChange = (id: ThemeId) => {
    setSelectedTheme(id)
    setThemeOpen(false)
  }

  const handleSaveConfig = async () => {
    if (!liveConfig || !liveSlug) return
    setSaveStatus("saving")
    try {
      const res = await fetch(`/api/tenant-config/${liveSlug}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: selectedTheme,
          content: liveConfig.content,
          branding: liveConfig.branding,
        }),
      })
      setSaveStatus(res.ok ? "saved" : "error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  // Highlighted JSON
  const getHighlightedJSON = (obj: any) => {
    const jsonStr = JSON.stringify(obj, null, 2)
    if (!jsonSearch) return jsonStr
    return jsonStr
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-6 bg-[#0f1117] text-slate-300">

      {/* ── Top Toolbar ── */}
      <div className="shrink-0 border-b border-white/5 bg-[#161922] px-6 py-4 flex items-center justify-between z-50 relative shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <LayoutTemplate className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Admin Cockpit</h1>
            <p className="text-[10px] text-slate-500">Single Source of Truth — Templates, Segmentos, Features</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">

          {/* Environment Toggle */}
          <div className="flex items-center bg-[#0f1117] border border-white/10 rounded-lg overflow-hidden">
            <button
              onClick={() => setEnvironment("lab")}
              className={`h-9 px-4 flex items-center gap-2 text-xs font-bold transition-all ${
                environment === "lab"
                  ? "bg-cyan-500/15 text-cyan-400 border-r border-cyan-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Lab
            </button>
            <button
              onClick={() => setEnvironment("production")}
              className={`h-9 px-4 flex items-center gap-2 text-xs font-bold transition-all ${
                environment === "production"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              Produção
            </button>
          </div>

          <div className="h-6 w-px bg-white/10 mx-1" />

          {/* Niche Selector */}
          <div className="relative">
            <button
              onClick={() => { setThemeOpen(false); setNicheOpen(!nicheOpen); }}
              className="h-9 px-4 rounded-lg bg-[#0f1117] border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              <span className="text-sm">{arvore.meta.emoji}</span>
              <span className="text-xs font-semibold text-white">{arvore.meta.nome}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            <AnimatePresence>
              {nicheOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full mt-2 w-72 bg-[#0c0e14] border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] grid grid-cols-1 gap-1 max-h-[500px] overflow-y-auto custom-scrollbar"
                >
                  <div className="px-2 py-1.5 mb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Selecione o Nicho
                  </div>
                  {niches.map(n => (
                    <button
                      key={n.slug}
                      onClick={() => handleNicheChange(n.slug)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-colors
                        ${selectedNiche === n.slug ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'}
                      `}
                    >
                      <span className="text-base">{n.icone}</span>
                      <span className="flex-1">{n.nome}</span>
                      {selectedNiche === n.slug && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-white/10 mx-1" />

          {/* Theme Selector */}
          <div className="relative">
            <button
              onClick={() => { setNicheOpen(false); setThemeOpen(!themeOpen); }}
              className="h-9 px-4 rounded-lg bg-[#0f1117] border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              <div className="flex gap-0.5">
                <span className="w-2 h-2 rounded-full" style={{ background: currentTheme.colors.dark.background }} />
                <span className="w-2 h-2 rounded-full" style={{ background: currentTheme.colors.dark.accent }} />
              </div>
              <span className="text-xs font-semibold text-white flex items-center gap-2">
                {currentTheme.nome}
                {suggestedThemeId === selectedTheme && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold tracking-widest uppercase">
                    Ideal
                  </span>
                )}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            <AnimatePresence>
              {themeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full mt-2 w-72 bg-[#0c0e14] border border-white/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2 z-[100] grid grid-cols-1 gap-1"
                >
                  <div className="px-2 py-1.5 mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Design System</span>
                  </div>
                  {themes.map(t => {
                    const isSuggested = suggestedThemeId === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleThemeChange(t.id)}
                        className={`flex flex-col gap-1.5 px-3 py-2.5 rounded-lg text-left transition-colors relative
                          ${selectedTheme === t.id ? 'bg-white/20 border-white/30' : 'hover:bg-white/5 border-transparent'}
                          border
                        `}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold ${selectedTheme === t.id ? 'text-white' : 'text-slate-200'}`}>
                            {t.nome}
                          </span>
                          {isSuggested && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{t.descricao}</p>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-white/10 mx-1" />

          {/* Pro Toggle */}
          <button
            onClick={() => setIsPro(!isPro)}
            className={`h-9 px-4 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all
              ${isPro
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                : 'bg-[#0f1117] border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
              }
            `}
          >
            {isPro ? <Sparkles className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            Modo Pro
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sub-Nav (Left vertical) ── */}
        <div className="w-56 shrink-0 border-r border-white/5 bg-[#12141c] p-4 flex flex-col gap-2 relative z-10">
          <div className="mb-4 px-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <SlidersHorizontal className="h-3 w-3" /> View Mode
            </p>
          </div>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 translate-x-1'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{tab.label}</span>
              {tab.badge && activeTab !== tab.id && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}

          {/* Tenant Slug Loader */}
          <div className="mt-6 px-2 pt-4 border-t border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Search className="h-3 w-3" /> Carregar Tenant
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLiveConfig(slugInput)}
                placeholder="slug do tenant"
                className="flex-1 h-8 px-3 bg-[#0f1117] border border-white/10 rounded-lg text-xs text-white placeholder:text-slate-500 focus:border-amber-500/30 focus:outline-none transition-colors"
              />
              <button
                onClick={() => fetchLiveConfig(slugInput)}
                disabled={liveLoading}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
              >
                {liveLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              </button>
            </div>
            {liveConfig && (
              <div className="mt-3 p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <p className="text-[10px] text-emerald-400 font-bold truncate">✓ {liveConfig.branding.name}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">v{liveConfig.metadata.version} · {liveConfig.segmentoName || liveConfig.segmento}</p>
              </div>
            )}
          </div>

          <div className="mt-auto px-2 pt-6 border-t border-white/5">
            <div className="bg-[#1a1d27] rounded-xl p-4 border border-white/5">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                <span className="text-amber-500 font-bold">Single Source of Truth.</span> Toda config feita aqui reflete em produção.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Canvas ── */}
        <div className="flex-1 bg-[#0a0b0f] overflow-hidden relative" onClick={() => { setNicheOpen(false); setThemeOpen(false); }}>

          {/* Decorative background blur */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.03] pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: currentTheme.colors.dark.accent }}
          />

          <div className="h-full w-full overflow-y-auto p-8 flex justify-center custom-scrollbar">

            <div className={`w-full transition-all duration-500 ${["config", "json", "history"].includes(activeTab) ? 'max-w-5xl' : 'max-w-[420px] md:max-w-4xl lg:max-w-5xl lg:h-[800px]'}`}>

              <AnimatePresence mode="wait">
                {activeTab === "site" && (
                  <motion.div
                    key="site"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full h-full bg-slate-900 rounded-[32px] md:rounded-[40px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col relative group"
                  >
                    {/* Fake Browser header */}
                    <div className="h-12 bg-[#161922] border-b border-white/5 flex items-center px-4 shrink-0 justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="px-4 py-1.5 rounded-lg bg-black/40 text-[10px] font-mono text-slate-400 flex items-center gap-2 border border-white/5">
                        <Lock className="h-2.5 w-2.5 text-emerald-500" />
                        ao.app/{arvore.meta.slug}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/template/${selectedNiche}?theme=${selectedTheme}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-[10px] font-bold transition-colors border border-amber-500/20"
                          title="Visualizar a tela cheia e interativa em nova janela"
                        >
                          Versão Final
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                      <div className="absolute inset-0 z-50 pointer-events-auto cursor-default" title="Modo visualização" />
                      <TemplateSitePreview data={mockTenant as any} theme={currentTheme} showPro={isPro} />
                    </div>
                  </motion.div>
                )}

                {activeTab === "dashboard" && (
                  <motion.div
                    key="dash"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full h-full bg-[#161922] rounded-[32px] md:rounded-[40px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col relative"
                  >
                    <div className="h-12 bg-[#0f1117] border-b border-white/5 flex items-center px-4 shrink-0 justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="px-4 py-1.5 rounded-lg bg-black/40 text-[10px] font-mono text-slate-400 flex items-center gap-2 border border-white/5">
                        <Lock className="h-2.5 w-2.5 text-emerald-500" />
                        app.agendaonline.io/dashboard
                      </div>
                      <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                      <TemplateDashboardPreview arvore={arvore} theme={currentTheme} showPro={isPro} />
                    </div>
                  </motion.div>
                )}

                {activeTab === "auth" && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full h-full bg-[#161922] rounded-[32px] md:rounded-[40px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden flex flex-col relative"
                  >
                    <div className="h-12 bg-[#0f1117] border-b border-white/5 flex items-center px-4 shrink-0 justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <div className="px-4 py-1.5 rounded-lg bg-black/40 text-[10px] font-mono text-slate-400 flex items-center gap-2 border border-white/5">
                        <Lock className="h-2.5 w-2.5 text-emerald-500" />
                        auth.agendaonline.io/{arvore.meta.slug}
                      </div>
                      <div className="w-10"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                      <TemplateAuthPreview arvore={arvore} theme={currentTheme} />
                    </div>
                  </motion.div>
                )}

                {activeTab === "config" && (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="w-full space-y-6"
                  >
                    {/* Config Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                          <Settings className="h-5 w-5 text-amber-500" />
                          Configuração
                          {environment === "lab" && (
                            <span className="text-[9px] px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/20">
                              Modo Lab
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Edite a configuração do template selecionado</p>
                      </div>
                      {liveConfig && (
                        <Button
                          onClick={handleSaveConfig}
                          disabled={saveStatus === "saving"}
                          className={`h-10 px-6 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                            saveStatus === "saved"
                              ? "bg-emerald-500 text-white"
                              : saveStatus === "error"
                              ? "bg-red-500 text-white"
                              : "bg-amber-500 text-slate-900 hover:bg-amber-400"
                          }`}
                        >
                          {saveStatus === "saving" ? (
                            <><RefreshCw className="h-4 w-4 animate-spin" /> Salvando...</>
                          ) : saveStatus === "saved" ? (
                            <><Check className="h-4 w-4" /> Salvo!</>
                          ) : saveStatus === "error" ? (
                            <><AlertTriangle className="h-4 w-4" /> Erro</>
                          ) : (
                            <><Save className="h-4 w-4" /> Salvar Alterações</>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Árvore do Nicho */}
                      <div className="bg-[#161922] rounded-2xl border border-white/5 p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                          <Eye className="h-4 w-4 text-emerald-500" /> Árvore Atual ({selectedNiche}.json)
                        </h3>
                        <div className="bg-[#0f1117] rounded-xl p-4 overflow-x-auto max-h-[600px] custom-scrollbar border border-white/5">
                          <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
                            {JSON.stringify(arvore, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Theme CSS Variables */}
                      <div className="bg-[#161922] rounded-2xl border border-white/5 p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                          <PaletteIcon className="h-4 w-4 text-amber-500" /> CSS Variables ({selectedTheme})
                        </h3>
                        <div className="bg-[#0f1117] rounded-xl p-4 overflow-x-auto custom-scrollbar border border-white/5 mb-6">
                          <pre className="text-[11px] text-amber-300 font-mono leading-relaxed">
                            {JSON.stringify(currentTheme.cssVariables, null, 2)}
                          </pre>
                        </div>

                        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                          Tokens de Design
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                            <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Tipografia</p>
                            <p className="text-xs text-white">Logo: <span className="font-mono text-blue-400">{currentTheme.typography.heading}</span></p>
                            <p className="text-xs text-white">Base: <span className="font-mono text-blue-400">{currentTheme.typography.body}</span></p>
                          </div>
                          <div className="bg-[#0f1117] rounded-xl p-4 border border-white/5">
                            <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">Estrutura</p>
                            <p className="text-xs text-white">Botões: <span className="font-mono text-purple-400">{currentTheme.buttons.style}</span></p>
                            <p className="text-xs text-white">Shadow: <span className="font-mono text-purple-400">{currentTheme.cards.shadow}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "json" && (
                  <motion.div
                    key="json"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="w-full space-y-6"
                  >
                    {/* JSON Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                          <Eye className="h-5 w-5 text-cyan-500" />
                          JSON Inspector
                          <span className="text-[9px] px-2 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/20">
                            {liveConfig ? "Live" : "Mock"}
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {liveConfig
                            ? `Tenant: ${liveConfig.branding.name} (${liveSlug})`
                            : "Carregar um tenant no menu lateral para ver dados reais"
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* JSON Search */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                          <input
                            type="text"
                            value={jsonSearch}
                            onChange={(e) => setJsonSearch(e.target.value)}
                            placeholder="Buscar no JSON..."
                            className="h-9 pl-9 pr-4 w-56 bg-[#0f1117] border border-white/10 rounded-lg text-xs text-white placeholder:text-slate-500 focus:border-cyan-500/30 focus:outline-none transition-colors"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const data = liveConfig || mockTenant
                            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                          }}
                          className="h-9 px-4 rounded-lg bg-[#0f1117] border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:border-white/20 flex items-center gap-2 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" /> Copiar
                        </button>
                      </div>
                    </div>

                    {liveConfig ? (
                      /* Live data — two columns: Lab vs Prod */
                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-[#161922] rounded-2xl border border-white/5 p-6 shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <Radio className="h-4 w-4 text-emerald-500" /> TenantConfig Completo
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-500">v{liveConfig.metadata.version}</span>
                              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                                {liveConfig.plan}
                              </span>
                            </div>
                          </div>
                          <div className="bg-[#0f1117] rounded-xl p-4 overflow-x-auto max-h-[700px] custom-scrollbar border border-white/5">
                            <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
                              {getHighlightedJSON(liveConfig)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Fallback: Mock data */
                      <div className="bg-[#161922] rounded-2xl border border-white/5 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <FlaskConical className="h-4 w-4 text-cyan-500" /> Mock TenantData (Simulação)
                          </h3>
                          <span className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-400 font-bold flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3" /> Dados simulados — carregue um slug real
                          </span>
                        </div>
                        <div className="bg-[#0f1117] rounded-xl p-4 overflow-x-auto max-h-[700px] custom-scrollbar border border-white/5">
                          <pre className="text-[11px] text-cyan-300 font-mono leading-relaxed whitespace-pre-wrap">
                            {getHighlightedJSON(mockTenant)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "history" && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="w-full space-y-6"
                  >
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-3">
                        <History className="h-5 w-5 text-amber-500" />
                        Histórico de Alterações
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Audit log de todas as configurações feitas</p>
                    </div>

                    {!liveConfig ? (
                      <div className="bg-[#161922] rounded-2xl border border-white/5 p-12 shadow-xl text-center">
                        <History className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-sm text-slate-400 mb-2">Nenhum tenant carregado</p>
                        <p className="text-xs text-slate-500">Carregue um tenant pelo slug no menu lateral para ver seu histórico.</p>
                      </div>
                    ) : (
                      <div className="bg-[#161922] rounded-2xl border border-white/5 p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-bold text-white">
                            Alterações em: {liveConfig.branding.name}
                          </h3>
                          <span className="text-[10px] text-slate-500">
                            Versão atual: v{liveConfig.metadata.version}
                          </span>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
                          <div className="flex gap-4 items-start">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30" />
                              <div className="w-px h-full bg-white/10 mt-1" />
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="text-xs font-bold text-white">Config carregada</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {new Date(liveConfig.metadata.updatedAt).toLocaleString("pt-BR")}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1">
                                Versão v{liveConfig.metadata.version} · Tema: {liveConfig.theme} · Segmento: {liveConfig.segmento}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/30" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white">Tenant criado</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {new Date(liveConfig.metadata.createdAt).toLocaleString("pt-BR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Publish Button */}
                    {liveConfig && environment === "lab" && (
                      <div className="bg-[#161922] rounded-2xl border border-cyan-500/10 p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <Rocket className="h-4 w-4 text-cyan-500" /> Publicar Lab → Produção
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-1">Aplica as configurações do Lab no ambiente de produção</p>
                          </div>
                          <Button
                            onClick={handleSaveConfig}
                            className="h-10 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center gap-2"
                          >
                            <Rocket className="h-4 w-4" /> Publicar Agora
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaletteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}
