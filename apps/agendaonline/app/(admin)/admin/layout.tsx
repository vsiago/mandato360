import { redirect } from "next/navigation"
import { requireRoot } from "@/lib/admin-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Server-side protection
    const { error } = await requireRoot()
    
    if (error) {
        return error
    }

    return (
        <div className="flex min-h-screen bg-stone-50 dark:bg-black">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
