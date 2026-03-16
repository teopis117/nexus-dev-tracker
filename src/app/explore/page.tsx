import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ExplorePage() {
  const supabase = await createClient()

  // Consulta global: Traemos TODOS los proyectos de la base de datos
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Directorio Global</h1>
            <p className="text-slate-500 mt-2">Explora los proyectos públicos de todos los Arquitectos.</p>
          </div>
          <Link href="/login">
            <Button variant="outline">Acceso Desarrolladores</Button>
          </Link>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">Error cargando el directorio.</div>
        ) : !projects || projects.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500">
            Aún no hay proyectos en la red global.
          </div>
        ) : (
          <div className="grid gap-4 w-full md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
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
        )}
      </div>
    </main>
  )
}