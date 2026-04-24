"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.")
            return
        }

        if (password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.")
            return
        }

        if (!token) {
            toast.error("Token de redefinição inválido ou ausente.")
            return
        }

        setIsLoading(true)
        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token: token
            })

            if (error) {
                toast.error(error.message || "Erro ao redefinir senha.")
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            }
        } catch (err) {
            toast.error("Ocorreu um erro inesperado.")
        } finally {
            setIsLoading(false)
        }
    }

    if (!token && !success) {
        return (
            <div className="w-full max-w-sm text-center">
                <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                    <h2 className="text-rose-600 dark:text-rose-400 font-bold mb-2">Link Inválido</h2>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                        Este link de recuperação parece estar quebrado ou expirado. Por favor, solicite um novo link.
                    </p>
                    <Button 
                        onClick={() => router.push("/esqueci-senha")}
                        variant="link" 
                        className="mt-4 text-amber-600 font-bold"
                    >
                        Solicitar novo link
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
                    Nova senha
                </h1>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                    Crie uma senha forte para proteger sua conta
                </p>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm p-8">
                {success ? (
                    <div className="text-center space-y-4 py-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-stone-900 dark:text-stone-50 mb-1">Senha redefinida!</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                Sua senha foi alterada com sucesso. Você será redirecionado para o login...
                            </p>
                        </div>
                        <div className="pt-2">
                            <Button 
                                onClick={() => router.push("/login")}
                                className="w-full btn-gold-solid"
                            >
                                Ir para Login
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-11"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="pl-10 h-11"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 btn-gold-solid font-semibold"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Redefinir Senha"
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
