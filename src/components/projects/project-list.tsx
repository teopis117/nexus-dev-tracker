import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
// Es un Server Component por defecto
export async function ProjectList() {
  // 1. Instanciamos el cliente de DB en el servidor
  const supabase = await createClient()

  // 2. Identificar quién está pidiendo ver la lista
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null // Si por alguna extraña razón no hay usuario, no renderizamos nada

  // 3. Ejecutamos la consulta a PostgreSQL con el filtro de Propiedad (.eq)
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id) // <-- LA REGLA DE PRIVACIDAD ABSOLUTA
    .order('created_at', { ascending: false })

  // 4. Manejo de estados de error desde el servidor
  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">Error al cargar proyectos: {error.message}</div>
  }

  // 5. Manejo de estado vacío (¡Esto faltaba en tu versión!)
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 mt-8">
        No tienes proyectos registrados. ¡Crea el primero arriba!
      </div>
    )
  }

  // 6. Renderizado de la UI
  return (
    <div className="grid gap-4 mt-8 w-full max-w-4xl mx-auto md:grid-cols-2">
      {projects.map((project) => (
        <Link href={`/project/${project.id}`} key={project.id} className="block group">
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
      </Link>
      ))}
    </div>
  )
}