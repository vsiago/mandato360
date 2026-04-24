"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function ConfirmarContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        async function verify() {
            if (!token) {
                setStatus("error")
                setMessage("Token de confirmação ausente.")
                return
            }

            try {
                const { error } = await authClient.verifyEmail({
                    query: { token }
                })

                if (error) {
                    setStatus("error")
                    setMessage(error.message || "Erro ao verificar e-mail.")
                } else {
                    setStatus("success")
                }
            } catch (err) {
                setStatus("error")
                setMessage("Ocorreu um erro inesperado.")
            }
        }

        verify()
    }, [token])

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl p-10 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />
                
                {status === "loading" && (
                    <div className="space-y-6 py-8">
                        <div className="relative h-20 w-20 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-amber-100 dark:border-amber-900/30" />
                            <Loader2 className="h-20 w-20 text-amber-500 animate-spin relative z-10" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">Verificando...</h1>
                            <p className="text-stone-500 dark:text-stone-400">Estamos validando seu endereço de e-mail.</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-8 py-4">
                        <div className="h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto scale-110">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">E-mail Confirmado!</h1>
                            <p className="text-stone-600 dark:text-stone-400 text-lg leading-relaxed">
                                Parabéns! Sua conta no <span className="font-semibold text-stone-900 dark:text-stone-100">AgendaOnline</span> agora está totalmente ativa.
                            </p>
                        </div>
                        
                        <div className="pt-4">
                            <Link href="/login">
                                <Button className="w-full h-14 text-lg btn-gold-solid rounded-xl font-bold group shadow-lg shadow-amber-500/20">
                                    Acessar meu Painel
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-8 py-4">
                        <div className="h-24 w-24 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mx-auto">
                            <XCircle className="h-12 w-12 text-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3">Ops! Algo deu errado</h1>
                            <p className="text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-950/20 py-2 px-4 rounded-lg inline-block">
                                {message}
                            </p>
                            <p className="text-stone-500 dark:text-stone-400 mt-4 text-sm">
                                O link pode ter expirado ou já ter sido utilizado. Tente solicitar um novo link de confirmação.
                            </p>
                        </div>
                        
                        <div className="pt-2">
                            <Link href="/login">
                                <Button variant="outline" className="w-full h-12 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 rounded-xl font-semibold">
                                    Voltar para o Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            
            <p className="mt-8 text-stone-400 dark:text-stone-600 text-sm">
                &copy; {new Date().getFullYear()} AgendaOnline. Gestão de Agendamentos Premium.
            </p>
        </div>
    )
}

export default function ConfirmarPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
            </div>
        }>
            <ConfirmarContent />
        </Suspense>
    )
}
