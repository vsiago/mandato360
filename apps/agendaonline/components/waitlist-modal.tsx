"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [niche, setNiche] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const isWhatsappValid = whatsapp.replace(/\D/g, "").length === 11;
    const isFormValid = name.trim().length >= 2 && isWhatsappValid && niche !== "";

    const formatWhatsapp = (value: string) => {
        // Remove tudo que não for número
        const numbers = value.replace(/\D/g, '');

        // Limita a 11 dígitos
        const limited = numbers.substring(0, 11);

        // Formata: (XX) XXXXX-XXXX
        let formatted = limited;
        if (limited.length > 2) {
            formatted = `(${limited.substring(0, 2)}`;
            if (limited.length > 7) {
                formatted += `) ${limited.substring(2, 7)}-${limited.substring(7, 11)}`;
            } else {
                formatted += `) ${limited.substring(2)}`;
            }
        }
        return formatted;
    };

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWhatsapp(e.target.value);
        setWhatsapp(formatted);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, whatsapp, niche }),
            });
 
            const data = await response.json();
 
            if (!response.ok) {
                throw new Error(data.message || "Erro ao realizar cadastro.");
            }
 
            setIsSuccess(true);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido. Tente novamente.";
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                    <X className="w-5 h-5" />
                </button>

                {isSuccess ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Lista de Espera Confirmada!
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
                            Obrigado por se cadastrar. Estaremos em contato em breve pelo seu WhatsApp com todas as novidades.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full btn-gold-solid py-3 rounded-xl font-medium"
                        >
                            Fechar
                        </button>
                    </div>
                ) : (
                    <div className="p-8 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Falta pouco para você<br />
                            <span className="text-amber-500 dark:text-amber-400 italic">automatizar sua agenda!</span>
                        </h3>
                        <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                            Cadastre-se na lista VIP e tenha acesso antecipado à plataforma.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1 text-left">
                                    Nome (ou Nome do Salão)
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 md:hover:bg-stone-100 dark:bg-stone-800 dark:md:hover:bg-stone-700/80 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-400/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200"
                                    placeholder="Ex: Studio Beauty"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1 text-left">
                                    Seu Nicho / Ramo de Atuação
                                </label>
                                <select
                                    required
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 md:hover:bg-stone-100 dark:bg-stone-800 dark:md:hover:bg-stone-700/80 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-400/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200"
                                >
                                    <option value="" disabled>Selecione seu nicho</option>
                                    <option value="salao">Salão de Beleza</option>
                                    <option value="estetica">Clínica de Estética</option>
                                    <option value="barbearia">Barbearia</option>
                                    <option value="tatuagem">Estúdio de Tatuagem</option>
                                    <option value="petshop">Pet Shop</option>
                                    <option value="outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1 text-left">
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    required
                                    maxLength={15}
                                    value={whatsapp}
                                    onChange={handleWhatsappChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${whatsapp.length > 0 && !isWhatsappValid ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : 'border-stone-200 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/50 dark:focus:ring-amber-400/50'} bg-stone-50 md:hover:bg-stone-100 dark:bg-stone-800 dark:md:hover:bg-stone-700/80 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                                    placeholder="(00) 00000-0000"
                                />
                                {whatsapp.length > 0 && !isWhatsappValid && (
                                    <p className="text-xs text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
                                        Digite um número válido com 11 dígitos.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !isFormValid}
                                className={`w-full py-4 rounded-xl font-bold shadow-lg mt-2 flex items-center justify-center transition-all duration-300 transform active:scale-[0.98] ${isFormValid
                                        ? "btn-gold-solid shadow-amber-500/20 md:hover:shadow-amber-500/40 md:hover:-translate-y-0.5 cursor-pointer border-0"
                                        : "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 shadow-none cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    "Quero meu acesso VIP"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
