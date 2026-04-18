"use client"

import { usePathname } from "next/navigation"

export function TenantMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isEditor = pathname.includes('/editar-site')

  return (
    <main className={isEditor ? "flex-1 flex flex-col overflow-hidden bg-[#0f0f12]" : "flex-1 overflow-y-auto px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6"}>
      {children}
    </main>
  )
}
