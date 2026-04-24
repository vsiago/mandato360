
"use client"


import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return (
            <button className={`h-9 w-9 rounded-full border border-stone-200 dark:border-stone-800 bg-transparent flex items-center justify-center ${className}`} aria-hidden="true">
                <div className="h-4 w-4" />
            </button>
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`group h-9 w-9 flex items-center justify-center rounded-full border border-stone-200 dark:border-stone-800/50 bg-transparent hover:bg-stone-50 dark:hover:bg-stone-900 transition-all duration-300 text-stone-500 hover:text-stone-900 dark:text-stone-500 dark:hover:text-amber-400 ${className}`}
            aria-label="Alternar tema"
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4 stroke-[1.5] transition-transform duration-500 group-hover:rotate-45" />
            ) : (
                <Moon className="h-4 w-4 stroke-[1.5] transition-transform duration-500 group-hover:-rotate-12" />
            )}
        </button>
    )
}
