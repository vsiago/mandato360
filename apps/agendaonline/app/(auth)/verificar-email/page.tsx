"use client"

import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function VerificarEmailPage() {
    const [isResending, setIsResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    const handleResend = async () => {
        setIsResending(true)
        try {
            // Better-auth uses the current session to resend verification
            const { error } = await authClient.sendVerificationEmail({
                email: "", // If empty, it uses the current user's email if logged in, but we might not be
                callbackURL: "/confirmar"
            })
            
            if (error) {
                toast.error(error.message || "Erro ao reenviar e-mail.")
            } else {
                setResendSuccess(true)
                toast.success("E-mail reenviado com sucesso!")
                setTimeout(() => setResendSuccess(false), 5000)
            }
        } catch (err) {
            toast.error("Ocorreu um erro inesperado.")
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
                <div className="h-20 w-20 bg-amber-50 dark:bg-amber-950/30 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                    <Mail className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                </div>
                <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">Verifique seu e-mail</h1>
                <p className="text-stone-500 dark:text-stone-400 text-lg">
                    Enviamos um link de ativação para o seu endereço de e-mail.
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-8 space-y-6">
                <div className="space-y-4">
                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                        Para garantir a segurança da sua conta e habilitar todas as funções do **AgendaOnline**, clique no link que enviamos.
                    </p>
                    
                    <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-100 dark:border-stone-800/50">
                        <h4 className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">Próximos passos:</h4>
                        <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-2">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Abra sua caixa de entrada
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Procure pelo e-mail do AgendaOnline
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                Clique no botão de confirmação
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-2">
                    <Button 
                        onClick={handleResend}
                        disabled={isResending || resendSuccess}
                        variant="outline" 
                        className="w-full h-12 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl font-semibold transition-all"
                    >
                        {isResending ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : resendSuccess ? (
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        {resendSuccess ? "Enviado!" : "Não recebi o e-mail"}
                    </Button>
                </div>
            </div>

            <div className="text-center mt-8">
                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Voltar para o login
                </Link>
            </div>
        </div>
    )
}
