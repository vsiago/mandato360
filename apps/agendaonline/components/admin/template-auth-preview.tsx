"use client"

import React, { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"
import type { ArvoreSegmento } from "@/src/arvores-segmentos/types"
import type { DesignTheme } from "@/src/themes/types"

interface Props {
  arvore: ArvoreSegmento
  theme: DesignTheme
  mode?: "login" | "register"
}

export function TemplateAuthPreview({ arvore, theme, mode: initialMode = "login" }: Props) {
  const [mode, setMode] = useState(initialMode)
  const [showPw, setShowPw] = useState(false)

  const accent = theme.colors.light.accent
  const bgDark = theme.colors.dark.background
  const surfDark = theme.colors.dark.surface
  const borderDark = theme.colors.dark.border
  const textLight = theme.colors.dark.text
  const textMuted = theme.colors.dark.textMuted

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ borderRadius: theme.spacing.borderRadius }}
    >
      {/* ── Left Panel — Brand ── */}
      <div
        className="w-[45%] shrink-0 relative flex flex-col justify-between p-8 overflow-hidden"
        style={{ backgroundColor: accent }}
      >
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-black/20 to-transparent" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: bgDark }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">{arvore.meta.emoji}</span>
            <span
              className="text-sm font-bold text-white"
              style={{ fontFamily: theme.cssVariables["--theme-font-heading"] }}
            >
              {arvore.meta.nome}
            </span>
          </div>

          <h2
            className="text-xl font-bold text-white leading-tight mb-3"
            style={{ fontFamily: theme.cssVariables["--theme-font-heading"] }}
          >
            {arvore.copyVoz.fraseImpacto}
          </h2>
          <p className="text-[10px] text-white/70 leading-relaxed">
            {arvore.heroPreset.subheadline}
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {arvore.trustBadges.slice(0, 3).map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
              <span className="text-[9px] font-medium text-white/80">{badge.texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div
        className="flex-1 flex flex-col justify-center p-8"
        style={{ backgroundColor: bgDark }}
      >
        {/* Tab toggle */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: surfDark }}>
          <button
            onClick={() => setMode("login")}
            className="flex-1 py-2 text-[10px] font-bold transition-all"
            style={{
              borderRadius: theme.cssVariables["--theme-btn-radius"],
              backgroundColor: mode === "login" ? accent : "transparent",
              color: mode === "login" ? "white" : textMuted,
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode("register")}
            className="flex-1 py-2 text-[10px] font-bold transition-all"
            style={{
              borderRadius: theme.cssVariables["--theme-btn-radius"],
              backgroundColor: mode === "register" ? accent : "transparent",
              color: mode === "register" ? "white" : textMuted,
            }}
          >
            Criar Conta
          </button>
        </div>

        <h3
          className="text-lg font-bold mb-1"
          style={{ fontFamily: theme.cssVariables["--theme-font-heading"], color: textLight }}
        >
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </h3>
        <p className="text-[10px] mb-6" style={{ color: textMuted }}>
          {mode === "login"
            ? "Acesse seu painel de agendamentos"
            : "Comece a gerenciar seus agendamentos"}
        </p>

        <div className="space-y-3">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: textMuted }} />
              <input
                type="text"
                placeholder="Seu nome completo"
                readOnly
                className="w-full pl-9 pr-4 py-2.5 text-[10px] border outline-none"
                style={{
                  backgroundColor: surfDark,
                  borderColor: borderDark,
                  borderRadius: theme.cssVariables["--theme-btn-radius"],
                  color: textLight,
                }}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: textMuted }} />
            <input
              type="email"
              placeholder="seu@email.com"
              readOnly
              className="w-full pl-9 pr-4 py-2.5 text-[10px] border outline-none"
              style={{
                backgroundColor: surfDark,
                borderColor: borderDark,
                borderRadius: theme.cssVariables["--theme-btn-radius"],
                color: textLight,
              }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: textMuted }} />
            <input
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              readOnly
              className="w-full pl-9 pr-9 py-2.5 text-[10px] border outline-none"
              style={{
                backgroundColor: surfDark,
                borderColor: borderDark,
                borderRadius: theme.cssVariables["--theme-btn-radius"],
                color: textLight,
              }}
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPw ? (
                <EyeOff className="h-3.5 w-3.5" style={{ color: textMuted }} />
              ) : (
                <Eye className="h-3.5 w-3.5" style={{ color: textMuted }} />
              )}
            </button>
          </div>

          {mode === "login" && (
            <div className="flex justify-end">
              <button className="text-[9px] font-medium" style={{ color: accent }}>
                Esqueci minha senha
              </button>
            </div>
          )}

          <button
            className="w-full py-2.5 text-[11px] font-bold text-white flex items-center justify-center gap-2 mt-2"
            style={{
              backgroundColor: accent,
              borderRadius: theme.cssVariables["--theme-btn-radius"],
            }}
          >
            {mode === "login" ? "Entrar" : "Criar Conta"}
            <ArrowRight className="h-3 w-3" />
          </button>

          {/* Social login */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-px flex-1" style={{ backgroundColor: borderDark }} />
            <span className="text-[8px] font-medium" style={{ color: textMuted }}>
              ou continue com
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: borderDark }} />
          </div>

          <button
            className="w-full py-2.5 text-[10px] font-bold border flex items-center justify-center gap-2"
            style={{
              borderColor: borderDark,
              borderRadius: theme.cssVariables["--theme-btn-radius"],
              backgroundColor: surfDark,
              color: textLight,
            }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
        </div>

        <p className="text-[8px] text-center mt-4" style={{ color: textMuted }}>
          Powered by <span className="font-bold" style={{ color: accent }}>Agenda Online</span>
        </p>
      </div>
    </div>
  )
}
