import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTask } from '@/actions/task' // Importamos la nueva acción

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
        </div>

        {/* --- NUEVA ZONA DE TAREAS --- */}
        <div className="space-y-6">
          {/* Formulario para agregar tarea */}

          {isOwner &&(

          <Card className="p-2 shadow-sm border-slate-200">
            <form action={createProjectTask} className="flex gap-2">
              <Input 
                name="title" 
                placeholder="¿Qué nueva tarea necesitas completar?" 
                required 
                className="border-none shadow-none focus-visible:ring-0 text-lg"
                autoComplete="off"
              />
              <Button type="submit" className="bg-slate-900 text-white shrink-0">
                Añadir Tarea
              </Button>
            </form>
          </Card>
          )}
          {/* Lista de Tareas */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Tareas 
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-sm">
                {tasks?.length || 0}
              </span>
            </h2>

            {!tasks || tasks.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 bg-white">
                El tablero está limpio. ¡Añade tu primera tarea!
              </div>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="p-4 flex items-center justify-between hover:border-slate-300 transition-colors">
                  <span className="font-medium text-slate-700">{task.title}</span>
                  {/* Placeholder visual para el botón de completar (Lo haremos funcional en el siguiente paso) */}
                  <div className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer hover:border-slate-500"></div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  )
}