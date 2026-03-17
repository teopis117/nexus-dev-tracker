import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTask } from '@/actions/task'
import { TaskItem } from '@/components/projects/task-item' // <-- ¡Aquí está la pieza faltante!
import { TaskList } from '@/components/projects/task-list'

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // 1. Buscamos el proyecto
  const { data: project, error: projectError } = await supabase
    .from('projects').select('*').eq('id', id).single()

  if (projectError || !project) notFound()

  // 2. Buscamos las tareas asociadas a ESTE proyecto
  const { data: tasks } = await supabase
    .from('tasks').select('*').eq('project_id', id).order('created_at', { ascending: false })

  // 3. ¿Quién está viendo esta página ahora mismo?
  const { data: { user } } = await supabase.auth.getUser()

  // 4. ¿El que está viendo es el dueño original del proyecto? (Autorización)
  const isOwner = user?.id === project.user_id

  const createProjectTask = createTask.bind(null, id)

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-slate-500 hover:text-slate-900">
            ← Volver al Panel
          </Button>
        </Link>

        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{project.name}</h1>
          <p className="text-slate-500 mt-2">{project.description || 'Sin descripción'}</p>
          
          {/* --- NUEVO: CAJA DEL CÓDIGO SECRETO --- */}
          {isOwner && (
            <div className="mt-4 inline-block p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-semibold mb-1">Código de Invitación (ID):</p>
              {/* select-all hace que al darle un clic, se seleccione todo el texto para copiarlo fácil */}
              <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-blue-100 select-all cursor-copy text-slate-700">
                {project.id}
              </code>
              <p className="text-xs text-blue-600 mt-1">Comparte este código con tu equipo para que se unan desde su panel.</p>
            </div>
          )}
        </div>

        {/* --- ZONA DE TAREAS --- */}
        <div className="space-y-6">
          {/* Formulario para agregar tarea */}
          
          {/* Lista de Tareas (Limpia y sin duplicados) */}
          {/* Formulario para agregar tarea */}
          {isOwner && (
            <Card className="p-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form action={createProjectTask} className="flex gap-2">
                <Input 
                  name="title" 
                  placeholder="¿Qué nueva tarea necesitas completar?" 
                  required 
                  className="border-none shadow-none focus-visible:ring-0 text-lg dark:bg-slate-900 dark:text-white"
                  autoComplete="off"
                />
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shrink-0">
                  Añadir Tarea
                </Button>
              </form>
            </Card>
          )}
          
          {/* --- NUESTRA NUEVA LISTA CON PESTAÑAS --- */}
          <TaskList tasks={tasks || []} projectId={id} isOwner={isOwner} />
        </div>

      </div>
    </main>
  )
}