import { Card } from '@/components/ui/card'

export default function ProjectLoading() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-24 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        
        {/* Botón Volver fantasma */}
        <div className="w-32 h-10 bg-slate-200 dark:bg-slate-800/80 rounded-md" />

        {/* Título y descripción fantasma */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-4">
          <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
          <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-800/80 rounded-md" />
        </div>

        {/* Zona de tareas fantasma */}
        <div className="space-y-6">
          
          {/* Input de nueva tarea fantasma */}
          <div className="h-16 w-full bg-slate-200 dark:bg-slate-800/80 rounded-lg" />
          
          {/* Pestañas (Tabs) fantasma */}
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800/80 rounded-md" />

          {/* Lista de Tareas fantasma */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-16 bg-slate-200/50 dark:bg-slate-800/50 border-none" />
            ))}
          </div>

        </div>

      </div>
    </main>
  )
}