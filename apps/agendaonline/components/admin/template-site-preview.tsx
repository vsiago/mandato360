"use client"

import React from "react"
import { motion } from "framer-motion"
import { Activity, ShieldCheck, MapPin, Phone, MessageCircle, Star, ArrowRight, ImageIcon, Instagram } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { TenantData } from "@/lib/tenant-types"
import type { DesignTheme } from "@/src/themes/types"
import { generateThemeCSS } from "@/src/themes"

interface Props {
  data: TenantData
  theme: DesignTheme
  showPro?: boolean
}

/**
 * Lightweight, self-contained site preview for the admin cockpit.
 * NO scheduling modal, NO WhatsApp widget, NO router deps.
 * Fully theme-aware via CSS variables.
 */
export function TemplateSitePreview({ data, theme, showPro = false }: Props) {
  const { primary, hover } = data.colors
  const themeVars = generateThemeCSS(theme, "light")
  const isDark = theme.id === "hightech"
  const filteredCategories = data.categories.filter((c) => c.id !== "todos")

  const bgBase = isDark ? "#020617" : "#f8fafc"
  const bgCard = isDark ? "#0f172a" : "#ffffff"
  const textMain = isDark ? "#f1f5f9" : "#0f172a"
  const textMuted = isDark ? "#94a3b8" : "#64748b"
  const borderC = isDark ? "#1e293b" : "#e2e8f0"

  return (
    <div
      className="min-h-0 font-sans text-sm overflow-hidden"
      style={{
        ...Object.fromEntries(Object.entries(themeVars).map(([k, v]) => [k, v])),
        "--tenant-primary": primary || "#8c6239",
        "--tenant-hover": hover || "#6d4a2a",
        fontFamily: theme.cssVariables["--theme-font-body"],
        backgroundColor: bgBase,
        color: textMain,
        borderRadius: theme.spacing.borderRadius,
      } as React.CSSProperties}
    >
      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-20 backdrop-blur-lg border-b px-5 py-3 flex items-center justify-between"
        style={{ borderColor: borderC, backgroundColor: isDark ? "#0f172acc" : "#ffffffcc" }}
      >
        <span
          className="font-bold text-base"
          style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textMain }}
        >
          {data.name}
        </span>
        <div className="flex items-center gap-3">
          {["Serviços", "Sobre", "FAQ"].map((l) => (
            <span key={l} className="text-[10px] font-medium" style={{ color: textMuted }}>
              {l}
            </span>
          ))}
          <button
            className="px-3 py-1.5 text-[10px] font-bold text-white"
            style={{
              backgroundColor: primary,
              borderRadius: theme.cssVariables["--theme-btn-radius"],
            }}
          >
            {data.ctaText}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative py-24 px-6 overflow-hidden flex flex-col items-center justify-center text-center min-h-[60vh]"
        style={{ backgroundColor: primary }}
      >
        <div className="absolute inset-0 opacity-20 bg-linear-to-br from-black/30 to-transparent" />
        <div className="relative z-10 max-w-lg space-y-4 flex flex-col items-center">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-white/90 rounded-full border border-white/20 bg-white/15 backdrop-blur-sm"
          >
            <Activity className="h-2.5 w-2.5" />
            {data.heroBadge}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: theme.cssVariables["--theme-font-heading"] }}
          >
            {data.heroHeadline}{" "}
            <span className="italic opacity-80">{data.heroHighlight}</span>.
          </h1>
          <p className="text-xs text-white/70 max-w-md">{data.description}</p>
          <div className="flex gap-2 pt-2 justify-center w-full mt-2">
            <button
              className="px-4 py-2 text-xs font-bold shadow-lg"
              style={{
                backgroundColor: bgCard,
                color: primary,
                borderRadius: theme.cssVariables["--theme-btn-radius"],
              }}
            >
              Agendar Horário
            </button>
            <button
              className="px-4 py-2 text-xs font-bold text-white border border-white/30 backdrop-blur-sm flex items-center justify-center gap-1.5"
              style={{ borderRadius: theme.cssVariables["--theme-btn-radius"] }}
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <ArrowRight className="h-2 w-2" style={{ color: primary }} />
              </div>
              Ver Serviços
            </button>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div
        className="py-3 overflow-hidden border-y flex items-center gap-6 px-6"
        style={{
          backgroundColor: isDark ? "#020617" : "#0f172a",
          borderColor: isDark ? "#1e293b" : "#1e293b",
        }}
      >
        {[...data.trustBadges, ...data.trustBadges].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="h-3 w-3" style={{ color: primary }} />
            <span className="text-white text-[8px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
              {typeof badge === "string" ? badge : badge.text}
            </span>
          </div>
        ))}
      </div>

      {/* ── Services ── */}
      <section className="py-12 px-6" style={{ backgroundColor: bgCard }}>
        <div className="text-center mb-8">
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textMain }}
          >
            Nossa <span style={{ color: primary }}>Expertise</span>
          </h2>
          <p className="text-[10px]" style={{ color: textMuted }}>
            Serviços personalizados para você
          </p>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          <span
            className="px-3 py-1 text-[9px] font-bold text-white"
            style={{
              backgroundColor: primary,
              borderRadius: theme.cssVariables["--theme-btn-radius"],
            }}
          >
            Todos
          </span>
          {filteredCategories.map((c) => (
            <span
              key={c.id}
              className="px-3 py-1 text-[9px] font-bold"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                color: textMuted,
                borderRadius: theme.cssVariables["--theme-btn-radius"],
              }}
            >
              {c.label}
            </span>
          ))}
        </div>

        {/* Service cards — show max 6 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.services.slice(0, showPro ? 9 : 6).map((svc) => (
            <div
              key={svc.id}
              className="group overflow-hidden border transition-all hover:-translate-y-0.5"
              style={{
                borderRadius: theme.cards.borderRadius,
                borderColor: borderC,
                backgroundColor: bgBase,
                boxShadow: theme.cards.shadow !== "none" ? theme.cssVariables["--theme-shadow"] : "none",
              }}
            >
              <div
                className="h-20 flex items-center justify-center"
                style={{ backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }}
              >
                <ImageIcon className="h-5 w-5" style={{ color: textMuted }} />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-semibold mb-0.5" style={{ color: textMain }}>
                  {svc.name}
                </p>
                <p className="text-[8px] line-clamp-1" style={{ color: textMuted }}>
                  {svc.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  {svc.price && (
                    <span className="text-[10px] font-bold" style={{ color: primary }}>
                      R$ {svc.price}
                    </span>
                  )}
                  <button
                    className="text-[8px] font-bold px-2 py-1 text-white"
                    style={{
                      backgroundColor: primary,
                      borderRadius: theme.cssVariables["--theme-btn-radius"],
                    }}
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About / Founder ── */}
      <section className="py-10 px-6" style={{ backgroundColor: bgBase }}>
        <div className="flex gap-6 items-center">
          <div
            className="w-20 h-24 shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
              borderRadius: theme.spacing.borderRadius,
            }}
          >
            <Star className="h-6 w-6" style={{ color: primary }} />
          </div>
          <div className="space-y-1.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em]" style={{ color: primary }}>
              {data.founder.role}
            </span>
            <h3
              className="text-base font-bold"
              style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textMain }}
            >
              {data.founder.name}
            </h3>
            <p className="text-[10px] italic" style={{ color: textMuted }}>
              &ldquo;{data.founder.bio}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10 px-6 border-t" style={{ backgroundColor: bgCard, borderColor: borderC }}>
        <h2
          className="text-lg font-bold text-center mb-6"
          style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textMain }}
        >
          Principais <span style={{ color: primary }}>Dúvidas</span>
        </h2>
        <div className="space-y-2 max-w-md mx-auto">
          {data.faq.slice(0, 4).map((item, i) => (
            <div
              key={i}
              className="px-4 py-3 border"
              style={{
                borderRadius: theme.spacing.borderRadius,
                borderColor: borderC,
                backgroundColor: bgBase,
              }}
            >
              <p className="text-[11px] font-semibold" style={{ color: textMain }}>
                {item.question}
              </p>
              <p className="text-[9px] mt-1" style={{ color: textMuted }}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-8 px-6 border-t" style={{ backgroundColor: bgBase, borderColor: borderC }}>
        <div className="flex gap-6">
          <div className="flex-1 space-y-3">
            <h3
              className="text-sm font-bold"
              style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textMain }}
            >
              Onde estamos
            </h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 shrink-0 mt-0.5" style={{ color: primary }} />
              <span className="text-[10px]" style={{ color: textMuted }}>
                {data.contact.address}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-3 w-3 shrink-0 mt-0.5" style={{ color: primary }} />
              <span className="text-[10px]" style={{ color: textMuted }}>
                {data.contact.phone}
              </span>
            </div>
          </div>
          <div
            className="w-32 h-20 flex items-center justify-center"
            style={{
              backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
              borderRadius: theme.spacing.borderRadius,
            }}
          >
            <MapPin className="h-6 w-6" style={{ color: textMuted }} />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 px-6 text-center" style={{ backgroundColor: primary }}>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
          {data.name}
        </p>
        <p className="text-[7px] text-white/40 uppercase tracking-widest">
          © {new Date().getFullYear()} · Powered by Agenda Online
        </p>
        <div className="flex justify-center gap-3 mt-3">
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
            <Instagram className="h-3 w-3 text-white" />
          </div>
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
            <MessageCircle className="h-3 w-3 text-white" />
          </div>
        </div>
      </footer>
    </div>
  )
}
