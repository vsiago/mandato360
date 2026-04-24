import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
                <Link href="/" className="flex items-center">
                    <img src="/logo-agenda-online.svg" alt="Agenda Online" className="h-8 md:h-12 w-auto" />
                </Link>
                <ThemeToggle />
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-0 sm:px-4 md:px-6 py-2 sm:py-6 md:py-12">
                {children}
            </div>

            {/* Footer — hidden on mobile for native feel */}
            <div className="hidden sm:block text-center py-4 text-xs text-stone-400 dark:text-stone-600">
                © {new Date().getFullYear()} Agenda Online. Todos os direitos reservados.
            </div>
        </div>
    )
}

