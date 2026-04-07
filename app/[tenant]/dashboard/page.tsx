import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentDemandas } from "@/components/dashboard/recent-demandas"
import { TermometroMandato } from "@/components/dashboard/termometro-mandato"
import { RadarProblemas } from "@/components/dashboard/radar-problemas"
import { RankingAssessores } from "@/components/dashboard/ranking-assessores"

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Visao geral do seu mandato
        </p>
      </div>

      <DashboardStats />

      {/* Termometro e Radar */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TermometroMandato />
        <RadarProblemas />
        <RankingAssessores />
      </div>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DashboardCharts />
      </div>

      <div className="mt-8">
        <RecentDemandas />
      </div>
    </div>
  )
}
