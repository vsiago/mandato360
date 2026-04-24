"use client"

import Link from "next/link"
import { LayoutDashboard, Globe, Settings, User } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminBar() {
    const { data: session } = authClient.useSession()

    if (!session?.user) return null

    return (
        <div data-admin-bar className="bg-stone-900 text-white py-2 px-4 flex items-center justify-between sticky top-0 z-100 border-b border-stone-800 shadow-xl backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-6">
                <Link href="/painel" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                    <div className="h-6 w-6 rounded bg-amber-500 flex items-center justify-center">
                        <LayoutDashboard className="h-3.5 w-3.5 text-black" />
                    </div>
                    <span className="text-xs font-bold tracking-tight uppercase">Painel de Controle</span>
                </Link>

                <div className="h-4 w-px bg-stone-700 hidden sm:block" />

                <div className="hidden sm:flex items-center gap-4 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                    <Link href="/editar-site" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <Globe className="h-3 w-3" /> Editar Site
                    </Link>
                    <Link href="/configuracoes" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <Settings className="h-3 w-3" /> Configurações
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden xs:flex flex-col items-end mr-1">
                    <span className="text-[10px] font-bold leading-none">{session.user.name}</span>
                    <span className="text-[9px] text-stone-500 leading-none mt-0.5 uppercase tracking-tighter">Administrador</span>
                </div>
                <Link href="/painel" className="group">
                    <Avatar className="h-7 w-7 ring-2 ring-stone-800 group-hover:ring-amber-500/50 transition-all">
                        <AvatarFallback className="bg-stone-800 text-white text-[9px] font-bold">
                            {session.user.name?.slice(0, 2).toUpperCase() || "AD"}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </div>
    )
}
