"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { demandasPorBairro, demandasPorCategoria } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

// Brand colors: #F74191 (primary pink), #AA2E65 (dark magenta)
const COLORS = ['#F74191', '#AA2E65', '#E85A9C', '#C44878', '#F9A8C9']

export function DashboardCharts() {
  return (
    <>
      {/* Grafico de Demandas por Bairro */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Demandas por Bairro</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demandasPorBairro} layout="vertical" margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis dataKey="bairro" type="category" tick={{ fill: '#64748b', fontSize: 10 }} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="quantidade" fill="#F74191" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafico de Demandas por Categoria */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg font-semibold">Demandas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={demandasPorCategoria}
                cx="50%"
                cy="45%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="quantidade"
                nameKey="categoria"
                label={false}
              >
                {demandasPorCategoria.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={50}
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value) => <span className="text-xs md:text-sm text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
