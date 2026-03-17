import { Card } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-24 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Zona de Formularios fantasma */}
        <div className="grid gap-6 w-full md:grid-cols-2">
          <Card className="h-[280px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border-none" />
          <Card className="h-[280px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border-none" />
        </div>

        {/* Zona de Lista de Proyectos fantasma */}
        <div className="grid gap-4 mt-8 md:grid-cols-2">
          {/* Dibujamos 4 tarjetas vacías simulando proyectos */}
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="h-[180px] bg-slate-200/60 dark:bg-slate-800/60 animate-pulse border-none rounded-xl" />
          ))}
        </div>

      </div>
    </main>
  )
}