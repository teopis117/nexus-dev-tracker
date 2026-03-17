import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export async function ProjectList() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

 // 1. Traemos los proyectos donde TÚ eres el dueño
  const { data: ownedProjects } = await supabase
    .from('projects')
    .select('*, tasks(id, is_completed)')
    .eq('user_id', user.id)

  // 2. Traemos los IDs de los proyectos a los que fuiste INVITADO
  const { data: memberships } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('user_id', user.id)

  const sharedProjectIds = memberships?.map(m => m.project_id) || []

  // 3. Traemos los datos de esos proyectos compartidos
  let sharedProjects: any[] = []
  if (sharedProjectIds.length > 0) {
    const { data } = await supabase
      .from('projects')
      .select('*, tasks(id, is_completed)')
      .in('id', sharedProjectIds)
    sharedProjects = data || []
  }

  // 4. FUSIONAMOS las dos listas y las ordenamos por fecha de creación
  const allProjects = [...(ownedProjects || []), ...sharedProjects]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  // Actualizamos la variable para que el resto del código siga funcionando
  const projects = allProjects

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 mt-8 max-w-4xl mx-auto bg-white">
        No tienes proyectos registrados. ¡Crea el primero arriba!
      </div>
    )
  }

  return (
    <div className="grid gap-4 mt-8 w-full max-w-4xl mx-auto md:grid-cols-2">
      {projects.map((project) => {
        // 2. MATEMÁTICAS DEL DASHBOARD
        // Extraemos las tareas o usamos un arreglo vacío si no hay
        const projectTasks = project.tasks || []
        const totalTasks = projectTasks.length
        
        // Filtramos para contar solo las que están completadas (is_completed === true)
        const completedTasks = projectTasks.filter((t: any) => t.is_completed).length
        
        // Calculamos el porcentaje (evitando dividir por cero)
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

        return (
          <Link href={`/project/${project.id}`} key={project.id} className="block group">
            <Card className="hover:shadow-md transition-all h-full group-hover:border-slate-400 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between"> 
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400 transition-colors">
  {project.name}
</CardTitle>
                  {/* Etiqueta dinámica: Si llega al 100%, se pone verde */}
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${progress === 100 && totalTasks > 0 ? 'bg-green-100 text-green-800' : 
                      project.status === 'planning' ? 'bg-blue-100 text-blue-800' : 
                      'bg-slate-100 text-slate-800'}`}>
                    {progress === 100 && totalTasks > 0 ? 'COMPLETADO' : project.status.toUpperCase()}
                  </span>
                </div>
                {project.description && (
                  <CardDescription className="mt-2 text-slate-600 dark:text-slate-400 line-clamp-2">
                    {project.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              {/* --- NUEVA ZONA DE ESTADÍSTICAS --- */}
              <CardContent>
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>Progreso del Proyecto</span>
                    <span>{completedTasks} de {totalTasks} tareas ({progress}%)</span>
                  </div>
                  
                  {/* Barra de progreso visual (Tailwind) */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ease-out 
                        ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>

            </Card>
          </Link>
        )
      })}
    </div>
  )
}