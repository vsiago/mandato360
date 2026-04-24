"use client"

import { CalendarDays, Clock, Folder, SlidersHorizontal, MoreHorizontal } from "lucide-react"

export function DashboardMockup({ className = "" }: { className?: string }) {
    return (
        <div className={`mockup-card-body w-full mx-auto z-10 pl-0 ${className}`}>
            {/* Left Sidebar */}
            <div className="mockup-sidebar shrink-0">
                {/* Logo */}
                <div className="text-amber-600 dark:text-[#E8A83A] mb-8">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>

                {/* Nav Icons */}
                <div className="flex flex-col gap-6 w-full items-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-linear-to-br dark:from-[#E8A83A]/20 dark:to-transparent border border-amber-200 dark:border-[#E8A83A]/30 flex items-center justify-center text-amber-600 dark:text-[#E8A83A] shadow-sm dark:shadow-[0_0_15px_rgba(232,168,58,0.15)] relative">
                        <CalendarDays className="h-5 w-5" />
                    </div>
                    <Clock className="h-5 w-5 text-stone-400 dark:text-[#666666] hover:text-stone-600 dark:hover:text-[#AAAAAA] transition-colors cursor-pointer" />
                    <Folder className="h-5 w-5 text-stone-400 dark:text-[#666666] hover:text-stone-600 dark:hover:text-[#AAAAAA] transition-colors cursor-pointer" />
                    <SlidersHorizontal className="h-5 w-5 text-stone-400 dark:text-[#666666] hover:text-stone-600 dark:hover:text-[#AAAAAA] transition-colors cursor-pointer" />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col pt-6 sm:pt-8 min-w-0">
                {/* Resumo Section */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
                    <span className="text-[13px] font-semibold text-stone-800 dark:text-[#E0E0E0] tracking-wide">Resumo de Agendamentos</span>
                    <MoreHorizontal className="h-4 w-4 text-stone-400 dark:text-[#555555]" />
                </div>

                <div className="mockup-stats-box mb-6 sm:mb-8 mx-1 flex flex-wrap sm:flex-nowrap">
                    <div className="flex-1 text-center py-3 sm:py-5 mockup-stats-active-col min-w-[30%]">
                        <p className="text-[20px] sm:text-[28px] font-bold text-amber-600 dark:text-[#E8A83A] leading-none mb-1">4</p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-amber-700 dark:text-[#D89B3C]">Hoje</p>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-black/5 dark:bg-white/5 my-auto" />
                    <div className="flex-1 text-center py-3 sm:py-5 min-w-[30%]">
                        <p className="text-[20px] sm:text-[28px] font-bold text-stone-800 dark:text-[#F5F5F5] leading-none mb-1">18</p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-[#888888]">Semana</p>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-black/5 dark:bg-white/5 my-auto" />
                    <div className="flex-1 text-center py-3 sm:py-5 min-w-[30%]">
                        <p className="text-[20px] sm:text-[28px] font-bold text-stone-800 dark:text-[#F5F5F5] leading-none mb-1">67</p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-stone-500 dark:text-[#888888]">Mês</p>
                    </div>
                </div>

                {/* Próximos Section */}
                <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
                    <span className="text-[13px] font-semibold text-stone-800 dark:text-[#E0E0E0] tracking-wide truncate">Próximos Agendamentos</span>
                    <MoreHorizontal className="h-4 w-4 shrink-0 text-stone-400 dark:text-[#555555]" />
                </div>

                <div className="flex flex-col gap-0 w-full bg-stone-50/50 dark:bg-[#131317] rounded-xl p-2 border border-black/5 dark:border-white/5 mx-1 shadow-inner shadow-black/5 dark:shadow-black/20">
                    {[
                        { time: "14:30", text: "Mariana Costa - Corte & Mechas" },
                        { time: "15:00", text: "Pedro Silva - Barba/Corte" },
                        { time: "16:00", text: "Ana Beatriz - Manicure" },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 sm:gap-4 py-2 sm:py-3 px-2 sm:px-4 relative group overflow-hidden hover:bg-black/2 dark:hover:bg-white/2 transition-colors rounded-lg ${i !== 2 ? 'mb-1' : ''}`}>
                            <div className="absolute inset-0 bg-linear-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 dark:from-[#E8A83A]/0 dark:via-[#E8A83A]/5 dark:to-[#E8A83A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="text-[11px] sm:text-[12px] font-bold text-amber-600 dark:text-[#E8A83A] w-8 sm:w-10 shrink-0">{item.time}</span>
                            <span className="text-[11px] sm:text-[12px] text-stone-600 dark:text-[#C0C0C0] font-medium leading-tight group-hover:text-stone-900 dark:group-hover:text-white transition-colors truncate">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
