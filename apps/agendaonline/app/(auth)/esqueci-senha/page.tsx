"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function EsqueciSenhaPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // TODO: integrate Better-Auth password reset
        setTimeout(() => {
            setIsLoading(false)
            setSent(true)
        }, 1500)
    }

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
                    Recuperar senha
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                    Enviaremos um link de recuperação para seu e-mail
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-8">
                {sent ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-stone-900 dark:text-stone-50 mb-1">E-mail enviado!</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                Verifique sua caixa de entrada e clique no link de recuperação.
                            </p>
                        </div>
                        <Link href="/login">
                            <Button variant="ghost" className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 font-semibold">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para login
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-stone-700 dark:text-stone-300 text-sm font-medium">
                                E-mail da conta
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="h-11 bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-400 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 btn-gold-solid font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> Enviar link</span>
                            )}
                        </Button>
                    </form>
                )}
            </div>

            {!sent && (
                <p className="text-center mt-6 text-sm text-stone-500 dark:text-stone-400">
                    Lembrou a senha?{" "}
                    <Link href="/login" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                        Fazer login
                    </Link>
                </p>
            )}
        </div>
    )
}

