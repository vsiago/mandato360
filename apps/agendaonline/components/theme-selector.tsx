"use client"

import { cn } from "@/lib/utils"
import { getAllThemes, type DesignTheme, type ThemeId } from "@/src/themes"
import { Check, Sparkles } from "lucide-react"

interface ThemeSelectorProps {
  value: ThemeId
  onChange: (theme: ThemeId) => void
  nicheSlug?: string
  variant?: "grid" | "compact"
  className?: string
}

const THEME_PREVIEWS: Record<ThemeId, { label: string; colors: string[]; font: string }> = {
  neutro: {
    label: "Neutro",
    colors: ["#FFFFFF", "#F8F9FA", "#1A1A2E", "#3B82F6"],
    font: "Inter",
  },
  classico: {
    label: "Clássico",
    colors: ["#FAFAF9", "#1C1917", "#C4956A", "#78716C"],
    font: "Playfair Display",
  },
  ludico: {
    label: "Lúdico",
    colors: ["#FFFBFE", "#FFF1F3", "#F43F5E", "#1A1A2E"],
    font: "Poppins",
  },
  hightech: {
    label: "Hightech",
    colors: ["#020617", "#0F172A", "#22D3EE", "#F1F5F9"],
    font: "Outfit",
  },
}

export function ThemeSelector({ value, onChange, variant = "grid", className }: ThemeSelectorProps) {
  const themes = getAllThemes()

  if (variant === "compact") {
    return (
      <div className={cn("flex gap-2", className)}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer",
              value === theme.id
                ? "border-amber-500 bg-amber-500/5 shadow-sm"
                : "border-stone-200/50 dark:border-stone-800/50 hover:border-stone-300 dark:hover:border-stone-700"
            )}
            title={theme.nome}
          >
            {/* Color dots */}
            <div className="flex gap-1">
              {THEME_PREVIEWS[theme.id].colors.map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-stone-200/30 dark:border-stone-700/30"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {theme.nome}
            </span>
            {value === theme.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      {themes.map((theme) => {
        const preview = THEME_PREVIEWS[theme.id]
        const isSelected = value === theme.id
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer",
              isSelected
                ? "border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]"
                : "border-stone-200/50 dark:border-stone-800/50 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md"
            )}
          >
            {/* Preview area */}
            <div
              className="relative h-28 p-4 flex flex-col justify-end"
              style={{ backgroundColor: preview.colors[0] }}
            >
              {/* Mini preview elements */}
              <div className="space-y-2">
                <div
                  className="w-16 h-1.5 rounded-full"
                  style={{ backgroundColor: preview.colors[2] }}
                />
                <div
                  className="text-[10px] font-bold"
                  style={{
                    color: preview.colors[3],
                    fontFamily: `'${preview.font}', sans-serif`,
                  }}
                >
                  {theme.emoji} Agendar Agora
                </div>
                <div className="flex gap-1">
                  {preview.colors.slice(1).map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-1 rounded-full"
                      style={{ backgroundColor: c, opacity: 0.5 }}
                    />
                  ))}
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Label */}
            <div className="p-3 bg-white dark:bg-stone-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {theme.emoji} {theme.nome}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {theme.descricao}
                  </p>
                </div>
                {isSelected && (
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Onboarding variant — dark theme, larger for the final step
 */
export function ThemeSelectorOnboarding({ value, onChange }: { value: ThemeId; onChange: (t: ThemeId) => void }) {
  const themes = getAllThemes()

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((theme) => {
        const preview = THEME_PREVIEWS[theme.id]
        const isSelected = value === theme.id
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative overflow-hidden rounded-3xl border-2 text-left transition-all duration-300 cursor-pointer active:scale-95",
              isSelected
                ? "border-amber-500 shadow-xl shadow-amber-500/20 scale-[1.02]"
                : "border-stone-800 hover:border-stone-600"
            )}
          >
            {/* Preview */}
            <div
              className="relative h-32 sm:h-36 p-5 flex flex-col justify-end"
              style={{ backgroundColor: preview.colors[0] }}
            >
              <div className="space-y-2">
                <div
                  className="w-20 h-2 rounded-full"
                  style={{ backgroundColor: preview.colors[2] }}
                />
                <div
                  className="text-xs font-bold"
                  style={{
                    color: preview.colors[3],
                    fontFamily: `'${preview.font}', sans-serif`,
                  }}
                >
                  {theme.emoji} Agendar Agora
                </div>
                <div className="flex gap-1.5">
                  {preview.colors.slice(1).map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-1 rounded-full"
                      style={{ backgroundColor: c, opacity: 0.5 }}
                    />
                  ))}
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Label */}
            <div className="p-4 bg-stone-950">
              <p className="text-sm font-bold text-white">
                {theme.emoji} {theme.nome}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {theme.descricao}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
