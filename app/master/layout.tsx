import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0A192F] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#112240] border-r border-white/10 flex flex-col relative z-20">
        <div className="p-6">
          <Link href="/master/tenants" className="flex items-center gap-2">
            <div className="bg-accent p-2 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-white font-outfit font-black text-xl uppercase tracking-tighter">
              MASTER<span className="text-accent underline decoration-2">360</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/master/tenants">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 gap-3 h-12">
              <LayoutDashboard className="h-5 w-5" />
              Gestão de Mandatos
            </Button>
          </Link>
          <Link href="/master/users">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 gap-3 h-12">
              <Users className="h-5 w-5" />
              Usuários Globais
            </Button>
          </Link>
          <Link href="/master/settings">
            <Button variant="ghost" className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 gap-3 h-12">
              <Settings className="h-5 w-5" />
              Configurações
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold truncate max-w-30">
                {session.user.name}
              </span>
              <span className="text-white/40 text-xs uppercase font-medium">
                Super Admin
              </span>
            </div>
            <Link href="/login">
              <Button size="icon" variant="ghost" className="text-white/40 hover:text-red-400">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
