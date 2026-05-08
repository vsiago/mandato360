"use client"

import * as React from "react"
import { X, LucideIcon, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"

interface BaseModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    icon: LucideIcon
    children: React.ReactNode
    footer?: React.ReactNode
    maxWidth?: string
    onBack?: () => void
    showCloseButton?: boolean
}

export function BaseModal({
    isOpen,
    onClose,
    title,
    description,
    icon: Icon,
    children,
    footer,
    maxWidth = "sm:max-w-md",
    onBack,
    showCloseButton = true
}: BaseModalProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const headerContent = (isDesktop: boolean) => (
        <div className={cn(
            "px-6 flex items-center gap-3 relative overflow-hidden bg-stone-50/50 dark:bg-stone-950/20 border-b border-stone-100 dark:border-white/5",
            isDesktop ? "py-4" : "py-4 mt-1"
        )}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl -z-10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            {onBack && (
                <button 
                    onClick={onBack}
                    className="h-10 w-10 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 transition-all cursor-pointer shadow-lg mr-1"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
            )}
            
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-white/5 flex items-center justify-center shrink-0 shadow-sm dark:shadow-2xl">
                <Icon className="h-5 w-5 text-brand-primary" />
            </div>
            
            <div className="flex-1">
                {isDesktop ? (
                    <DialogTitle className="text-lg font-bold text-foreground tracking-tight leading-tight">
                        {title}
                    </DialogTitle>
                ) : (
                    <DrawerTitle className="text-lg font-bold text-foreground tracking-tight leading-tight">
                        {title}
                    </DrawerTitle>
                )}
                {description && (
                    isDesktop ? (
                        <DialogDescription className="text-[11px] text-stone-500 font-medium leading-relaxed mt-1">
                            {description}
                        </DialogDescription>
                    ) : (
                        <DrawerDescription className="text-[11px] text-stone-500 font-medium leading-relaxed mt-1">
                            {description}
                        </DrawerDescription>
                    )
                )}
            </div>
            
            {showCloseButton && isDesktop && (
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-900/50 flex items-center justify-center text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 transition-all cursor-pointer z-10"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent 
                    showCloseButton={false}
                    className={cn(
                        "p-0 overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/10 rounded-3xl shadow-xl dark:shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col",
                        maxWidth
                    )}
                >
                    {headerContent(true)}
                    <div className="p-6">
                        {children}
                    </div>
                    {footer && (
                        <div className="p-6 pt-0">
                            {footer}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="p-0 overflow-hidden bg-white dark:bg-stone-900 border-stone-200 dark:border-white/10 rounded-t-[2.5rem] flex flex-col max-h-[92vh]">
                {headerContent(false)}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className="p-6 pt-0">
                        {footer}
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    )
}
