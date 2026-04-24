"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, CreditCard } from "lucide-react";

// Variações realistas de clientes e pagamentos
const OUTCOMES = [
    { name: "Luana", time: "15:30", price: "R$ 120", action: "Novo agendamento" },
    { name: "Camila", time: "16:00", price: "R$ 65", action: "Agendamento online" },
    { name: "Juliana", time: "17:30", price: "R$ 350", action: "Novo agendamento" },
    { name: "Amanda", time: "09:00", price: "R$ 80", action: "Agendamento online" },
    { name: "Fernanda", time: "14:00", price: "R$ 250", action: "Novo agendamento" }
];

export function HeroOutcomeUI() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Ciclo de 7 segundos: permite que a animação complete (6.5s) antes de trocar o dado e reiniciar
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % OUTCOMES.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const data = OUTCOMES[index];

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes popup-enter {
          0% { 
            opacity: 0; 
            transform: translateY(24px) scale(0.95); 
            pointer-events: none; 
          }
          10% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
            pointer-events: auto; 
          }
          85% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
            pointer-events: auto; 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-16px) scale(0.98); 
            pointer-events: none; 
          }
        }
        
        /* Curva de animação profissional (spring suave) */
        .anim-ui-1 { animation: popup-enter 6.5s cubic-bezier(0.2, 0.9, 0.3, 1.1) both; animation-delay: 0s; }
        .anim-ui-2 { animation: popup-enter 6.5s cubic-bezier(0.2, 0.9, 0.3, 1.1) both; animation-delay: 1.2s; }
        .anim-ui-3 { animation: popup-enter 6.5s cubic-bezier(0.2, 0.9, 0.3, 1.1) both; animation-delay: 2.4s; }
        
        /* Pausa caso o usuário passe o mouse por cima */
        .anim-ui-1:hover, .anim-ui-2:hover, .anim-ui-3:hover { animation-play-state: paused; }
      `}} />

            {/* Ao usar key, o React recria o DOM e força o reset instantâneo das CSS animations */}
            <div key={index} className="absolute left-2 scale-110 right-0 z-50 -bottom-24 px-3 lg:px-0 lg:inset-0 pointer-events-none flex flex-col items-start gap-2.5 lg:block">

                {/* Balloon 1: Novo Agendamento */}
                <div className="relative lg:absolute lg:left-auto lg:-top-6 lg:-right-8 z-40 anim-ui-1 pointer-events-auto max-w-[90%] lg:w-auto">
                    <div className="mockup-bubble-glass p-2.5 pr-4 lg:px-4 lg:py-3 min-w-0 lg:min-w-55 w-full transform transition-transform hover:scale-105 duration-300 rounded-2xl lg:rounded-3xl">
                        <div className="flex items-center gap-2.5 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                                <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-[11px] lg:text-[12px] font-medium text-stone-900 dark:text-[#E0E0E0] leading-tight truncate">
                                {data.action}:<br /><span className="text-stone-900 dark:text-white font-bold">{data.name} ({data.time})</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balloon 2: WhatsApp Confirmation */}
                <div className="relative lg:absolute ml-4 lg:ml-0 lg:-left-18 lg:-translate-x-12 lg:bottom-[12%] z-30 anim-ui-2 pointer-events-auto max-w-[90%] lg:w-auto lg:mt-2">
                    <div className="mockup-bubble-glass p-2.5 pr-4 lg:px-4 lg:py-3 min-w-0 lg:min-w-55 w-full transform transition-transform hover:scale-105 duration-300 rounded-2xl lg:rounded-3xl">
                        <div className="flex items-center gap-2.5 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center border border-blue-200 dark:border-blue-500/30 shrink-0">
                                <MessageCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-[11px] lg:text-[12px] font-medium text-stone-900 dark:text-[#E0E0E0] leading-tight truncate">
                                Confirmação enviada:<br /><span className="text-stone-900 dark:text-white font-bold">WhatsApp p/ {data.name}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Balloon 3: Payment */}
                <div className="relative lg:absolute ml-8 lg:ml-0 lg:left-auto lg:right-0 lg:-bottom-8 z-20 anim-ui-3 pointer-events-auto max-w-[80%] lg:w-auto lg:mt-2">
                    <div className="mockup-bubble-glass p-2.5 pr-4 lg:px-4 lg:py-3 min-w-0 lg:min-w-55 w-full transform transition-transform hover:scale-105 duration-300 rounded-2xl lg:rounded-3xl">
                        <div className="flex items-center gap-2.5 lg:gap-3">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-amber-100 dark:bg-[#E8A83A]/20 flex items-center justify-center border border-amber-200 dark:border-[#E8A83A]/30 shrink-0">
                                <CreditCard className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-amber-600 dark:text-[#E8A83A]" />
                            </div>
                            <p className="text-[11px] lg:text-[12px] font-medium text-stone-900 dark:text-[#E0E0E0] leading-tight truncate">
                                Pagamento confirmado:<br /><span className="text-stone-900 dark:text-white font-bold">{data.name} - {data.price}</span>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
