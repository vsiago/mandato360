"use client"

import Link from "next/link"
import { Building2, Plus, Users, Globe } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Administração</h1>
                <p className="text-sm text-muted-foreground">Gerenciamento global de inquilinos e usuários.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-foreground">Novo Inquilino</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Crie um inquilino demo rapidamente com um usuário de teste gerado automaticamente.
                    </p>
                    <Link href="/admin/novo" className="inline-flex items-center justify-center w-full h-10 bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 font-medium rounded-lg hover:bg-stone-800 dark:hover:bg-amber-600 transition-colors text-sm">
                        Criar Inquilino Express
                    </Link>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm opacity-60">
                    <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-xl flex items-center justify-center mb-4">
                        <Building2 className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-foreground">Inquilinos</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Gerencie todos os inquilinos, visualize métricas e configurações.
                    </p>
                    <button disabled className="inline-flex items-center justify-center w-full h-10 bg-stone-200 dark:bg-stone-800 text-stone-500 font-medium rounded-lg text-sm cursor-not-allowed">
                        Em breve
                    </button>
                </div>

                <div className="bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm opacity-60">
                    <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-foreground">Usuários</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Gerencie contas de usuários, permissões e redefinição de senhas.
                    </p>
                    <button disabled className="inline-flex items-center justify-center w-full h-10 bg-stone-200 dark:bg-stone-800 text-stone-500 font-medium rounded-lg text-sm cursor-not-allowed">
                        Em breve
                    </button>
                </div>
            </div>
        </div>
    )
}
