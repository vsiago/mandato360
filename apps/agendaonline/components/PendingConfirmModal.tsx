"use client"

import React from "react"
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export function PendingConfirmModal({
    isOpen,
    onClose,
    appointment,
    onConfirm
}: {
    isOpen: boolean
    onClose: () => void
    appointment: any
    onConfirm: (appointmentId: string, date: string) => void
}) {
    if (!appointment) return null;

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 rounded-t-3xl shadow-2xl border-t px-6 pt-2 pb-8 z-[100]">
                <div className="flex flex-col items-center justify-center text-center mt-6">
                    <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <DrawerTitle className="text-xl font-black text-stone-900 dark:text-white mb-2">Confirmar Agendamento?</DrawerTitle>
                    <DrawerDescription className="text-stone-500 dark:text-stone-400 text-sm max-w-xs mx-auto mb-8">
                        <span className="font-bold text-stone-900 dark:text-white block mb-1">{appointment.name}</span>
                        {appointment.service} • <span className="font-semibold text-emerald-600 dark:text-emerald-500">{appointment.time}</span>
                    </DrawerDescription>
                </div>
                <DrawerFooter className="p-0 gap-3">
                    <Button 
                        onClick={() => {
                            onConfirm(appointment.id, appointment.date);
                        }} 
                        className="w-full h-14 text-base rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20 font-black transition-all"
                    >
                        Confirmar Horário
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        className="w-full h-12 text-sm rounded-2xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 font-medium"
                    >
                        Mais tarde
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
