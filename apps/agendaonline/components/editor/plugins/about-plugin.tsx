"use client"

import { useState } from "react"
import { EditorPlugin, PluginSectionProps, PluginSidebarProps } from "@mandato360/editor"
import { User, Star, Type, Image as ImageIcon, ChevronDown, Upload, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* ═══════════════════════════════════════════
   PREVIEW — Layout Premium idêntico ao /[slug]
   ═══════════════════════════════════════════ */
function AboutPreview({ config, device, themeColors }: PluginSectionProps) {
  const founder = config.founder || {}
  const badge = config.badge || "Compromisso com a Excelência"
  const title = config.title || "A *Expert* cuidando da sua autoestima."
  const bio = config.bio || "Apaixonado(a) por transformar vidas através da beleza e do cuidado. Cada cliente é único e merece uma experiência personalizada."
  const role = founder.role || "Fundador(a) & Especialista"
  const name = founder.name || "Seu Nome"

  return (
    <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
      {/* Background Decorative Element */}
      <div 
        className="absolute top-0 right-0 w-full h-full opacity-[0.03]" 
        style={{ background: `radial-gradient(circle at top right, ${themeColors.primary} 0%, transparent 40%)` }}
      />
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className={cn(
          "grid gap-12 lg:gap-24 items-center",
          device === "mobile" ? "grid-cols-1" : "lg:grid-cols-2"
        )}>
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="relative"
          >
            <div 
              className="absolute -inset-4 lg:-inset-8 rounded-(--theme-card-radius) blur-3xl opacity-60" 
              style={{ backgroundColor: `${themeColors.primary}15` }}
            />
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-(--theme-card-radius) bg-slate-50 overflow-hidden shadow-2xl border border-slate-100 group">
              {founder.imageUrl ? (
                <img 
                  src={founder.imageUrl} 
                  alt={name} 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center transition-transform duration-700 group-hover:scale-105 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/40 rounded-full blur-2xl"></div>
                  <div className="relative z-10 w-32 h-32 rounded-full bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white flex items-center justify-center backdrop-blur-sm">
                    <User className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
                  </div>
                </div>
              )}
              
              {/* Floating Name Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/70 backdrop-blur-xl rounded-(--theme-card-radius) border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transform transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] mb-1" style={{ color: themeColors.primary }}>
                  {role}
                </p>
                <h4 className="font-bold text-slate-900 text-base">{name}</h4>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="space-y-8"
          >
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ backgroundColor: `${themeColors.primary}08`, borderColor: `${themeColors.primary}20`, color: themeColors.primary }}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              {badge}
            </div>

            {/* Title */}
            <h2 
              className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              {title.includes("*") ? (
                <>
                  {title.split("*")[0]}
                  <span className="italic" style={{ color: themeColors.primary }}>{title.split("*")[1]}</span>
                  {title.split("*")[2] || ""}
                </>
              ) : title}
            </h2>

            {/* Divider */}
            <div 
              className="w-16 h-1 rounded-full" 
              style={{ backgroundColor: `${themeColors.primary}20` }}
            />

            {/* Bio */}
            <p className="text-xl text-slate-600 leading-relaxed font-light italic">
              &quot;{bio}&quot;
            </p>

            {/* Footer Signature */}
            <div className="pt-8 border-t border-slate-100">
              <h3 
                className="text-2xl font-bold" 
                style={{ color: themeColors.primary, fontFamily: 'var(--font-serif, serif)' }}
              >
                {name}
              </h3>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">
                {role}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SIDEBAR — Edição rica (Mandato360 parity)
   ═══════════════════════════════════════════ */
function AboutSidebar({ config, onChange, accentColor = "#10b981", onImageUpload }: PluginSidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const founder = config.founder || {}

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImageUpload) return

    try {
      setIsUploading(true)
      const url = await onImageUpload(file)
      onChange({ ...config, founder: { ...founder, imageUrl: url } })
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    onChange({ ...config, founder: { ...founder, imageUrl: "" } })
  }

  return (
    <div className="flex-1">
      {/* Conteúdo Accordion */}
      <div className="border-b border-border">
        <button
          onClick={() => setOpenAccordion(openAccordion === "content" ? null : "content")}
          className={cn(
            "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
            openAccordion === "content" && "bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <Type className={cn(
              "h-4 w-4 transition-colors duration-200",
              openAccordion === "content" ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
            )} style={openAccordion === "content" ? { color: accentColor } : undefined} />
            <span className={cn(
              "text-sm font-medium transition-colors duration-200",
              openAccordion === "content" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>Conteúdo</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
              openAccordion === "content" && "rotate-180 text-muted-foreground"
            )}
          />
        </button>
        {openAccordion === "content" && (
          <div className="space-y-4 px-4 pb-4 pt-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">Destaque (Badge)</Label>
                <Input
                  value={config.badge || ""}
                  onChange={(e) => onChange({ ...config, badge: e.target.value })}
                  placeholder="Ex: Compromisso com a Excelência"
                  className="h-8 text-[11px] border-border/50 bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">Título Principal</Label>
                <Input
                  value={config.title || ""}
                  onChange={(e) => onChange({ ...config, title: e.target.value })}
                  placeholder="A *Expert* cuidando da sua autoestima."
                  className="h-8 text-[11px] border-border/50 bg-background"
                />
                <p className="text-[9px] text-muted-foreground/40">Use *texto* para itálico colorido</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-foreground/70">Biografia / Citação</Label>
                <textarea
                  value={config.bio || ""}
                  onChange={(e) => onChange({ ...config, bio: e.target.value })}
                  placeholder="Fale um pouco sobre sua trajetória..."
                  className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 text-[11px] text-foreground outline-none resize-none min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground/70">Nome do Profissional</Label>
                  <Input
                    value={founder.name || ""}
                    onChange={(e) => onChange({ ...config, founder: { ...founder, name: e.target.value } })}
                    placeholder="Seu Nome"
                    className="h-8 text-[11px] border-border/50 bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-medium text-foreground/70">Cargo / Especialidade</Label>
                  <Input
                    value={founder.role || ""}
                    onChange={(e) => onChange({ ...config, founder: { ...founder, role: e.target.value } })}
                    placeholder="Ex: Fundador(a) & Especialista"
                    className="h-8 text-[11px] border-border/50 bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Imagem Accordion */}
      <div className="border-b border-border">
        <button
          onClick={() => setOpenAccordion(openAccordion === "image" ? null : "image")}
          className={cn(
            "group flex w-full items-center justify-between p-4 text-left transition-all duration-200 hover:bg-muted",
            openAccordion === "image" && "bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <ImageIcon className={cn(
              "h-4 w-4 transition-colors duration-200",
              openAccordion === "image" ? "text-current" : "text-muted-foreground/50 group-hover:text-foreground"
            )} style={openAccordion === "image" ? { color: accentColor } : undefined} />
            <span className={cn(
              "text-sm font-medium transition-colors duration-200",
              openAccordion === "image" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}>Imagem do Especialista</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
              openAccordion === "image" && "rotate-180 text-muted-foreground"
            )}
          />
        </button>
        {openAccordion === "image" && (
          <div className="space-y-4 px-4 pb-4 pt-2">
            {founder.imageUrl ? (
              <div className="relative group">
                <img
                  src={founder.imageUrl}
                  alt="Preview"
                  className="h-48 w-full rounded-xl border border-border object-cover object-top"
                />
                <button
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors hover:bg-muted",
                isUploading && "pointer-events-none opacity-50"
              )} style={{ borderColor: `${accentColor}30` }}>
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-xs font-medium text-muted-foreground">
                  {isUploading ? "Enviando..." : "Clique para upload"}
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
              </label>
            )}
            <p className="text-[10px] text-muted-foreground/60 text-center">Recomendado: Imagem vertical (4:5) com fundo neutro.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const aboutPlugin: EditorPlugin = {
  id: "about",
  label: "Sobre",
  icon: User,
  previewComponent: AboutPreview,
  sidebarComponent: AboutSidebar,
  defaultConfig: {
    badge: "Compromisso com a Excelência",
    title: "A *Expert* cuidando da sua autoestima.",
    bio: "Apaixonado(a) por transformar vidas através da beleza e do cuidado. Cada cliente é único e merece uma experiência personalizada.",
    founder: {
      name: "Seu Nome",
      role: "Fundador(a) & Especialista",
      imageUrl: ""
    }
  }
}
