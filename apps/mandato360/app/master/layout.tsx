import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MasterSidebar } from "@/components/sistema/master-sidebar";
import { MasterTopbar } from "@/components/sistema/master-topbar";
import { MasterBottomBar } from "@/components/sistema/master-bottombar";

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
    <div className="flex h-[100dvh] overflow-hidden bg-[#F0F3F8]">
      {/* Sidebar — desktop apenas */}
      <MasterSidebar user={session.user} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <MasterTopbar />
        {/* Extra padding-bottom no mobile para a bottombar */}
        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24 lg:px-8 lg:py-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom navigation bar — apenas mobile */}
      <MasterBottomBar />
    </div>
  );
}
