import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Es un Server Component por defecto (no tiene 'use client')
export async function ProjectList() {
  // 1. Instanciamos el cliente de DB en el servidor
  const supabase = await createClient()

  // 2. Ejecutamos la consulta a PostgreSQL
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false }) // Los más nuevos primero

  // 3. Manejo de estados de error o vacío desde el servidor
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error al cargar proyectos: {error.message}</div>
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 mt-8">
        No hay proyectos registrados. ¡Crea el primero arriba!
      </div>
    )
  }

  // 4. Renderizado de la UI
  return (
    <div className="grid gap-4 mt-8 w-full max-w-4xl mx-auto md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{project.name}</CardTitle>
              {/* Badge visual para el estado */}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${project.status === 'planning' ? 'bg-blue-100 text-blue-800' : 
                  project.status === 'active' ? 'bg-green-100 text-green-800' : 
                  'bg-slate-100 text-slate-800'}`}>
                {project.status.toUpperCase()}
              </span>
            </div>
            {project.description && (
              <CardDescription className="mt-2 text-slate-600">
                {project.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}