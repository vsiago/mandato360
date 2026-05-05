"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, User } from "lucide-react"

export function TenantWhatsapp({ DATA, primary }: { DATA: any, primary: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024) {
                setShowButton(window.scrollY > 300)
            } else {
                setShowButton(true)
            }
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [])

    const handleSend = () => {
        if (!message.trim()) return
        const whatsappUrl = `https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        setIsOpen(false)
        setMessage("")
    }

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none"
                >
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="pointer-events-auto w-[300px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                            >
                                <div className="bg-tenant-primary px-6 py-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 shrink-0 relative bg-white/20 flex items-center justify-center">
                                            {(DATA.chat?.avatarUrl || DATA.avatarUrl || DATA.profileImageUrl) ? (
                                                <Image src={DATA.chat?.avatarUrl || DATA.avatarUrl || DATA.profileImageUrl} alt={DATA.name} fill className="object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-white/70" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white text-sm leading-tight line-clamp-1">{DATA.name}</span>
                                            <span className="text-[10px] text-white/80 uppercase tracking-widest mt-0.5 font-medium">Online agora</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="p-5 bg-slate-50/50">
                                    <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-slate-100 mb-4 ml-2 mr-6 text-sm text-slate-700">
                                        Olá maravilhosa! ✨<br />Como posso ajudar a realçar sua beleza hoje?
                                    </div>
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Digite sua dúvida..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            className="w-full h-12 pl-4 pr-12 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-tenant-primary focus:ring-1 focus:ring-tenant-primary transition-all shadow-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            className="absolute right-1 top-1 h-10 w-10 bg-tenant-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:hover:scale-100"
                                            disabled={!message.trim()}
                                        >
                                            <Send className="h-4 w-4 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="pointer-events-auto flex items-center justify-center h-14 w-14 rounded-full bg-tenant-primary text-white shadow-xl shadow-tenant-primary/30 hover:scale-110 active:scale-95 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <X className="h-6 w-6" />
                                </motion.div>
                            ) : (
                                <motion.div key="icon" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                                    <MessageCircle className="h-6 w-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
