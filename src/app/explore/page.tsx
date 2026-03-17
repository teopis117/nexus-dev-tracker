import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ExplorePage() {
  const supabase = await createClient()

  // 1. Traemos TODOS los proyectos de la red
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  // 2. Traemos TODOS los perfiles registrados
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  // 3. LA FUSIÓN (Server-Side Join)
  // Cruzamos la información: Buscamos a quién le pertenece cada proyecto
  const projectsWithAuthors = projects?.map(project => {
    const author = profiles?.find(p => p.id === project.user_id)
    return {
      ...project,
      // Si el autor no ha llenado su perfil, le ponemos un nombre por defecto
      authorName: author?.full_name || 'Arquitecto Anónimo',
      authorRole: author?.role || 'Explorador de la Red'
    }
  })

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Directorio Global</h1>
            <p className="text-slate-500 mt-2">Explora las obras maestras de la comunidad Nexus.</p>
          </div>
          <Link href="/login">
            <Button variant="outline">Acceso Desarrolladores</Button>
          </Link>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">Error cargando el directorio.</div>
        ) : !projectsWithAuthors || projectsWithAuthors.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 bg-white">
            Aún no hay proyectos en la red global.
          </div>
        ) : (
          <div className="grid gap-6 w-full md:grid-cols-2">
            {projectsWithAuthors.map((project) => (
              
              // Hacemos que la tarjeta pública también sea clickeable para ver sus tareas (Modo Lectura)
              <Link href={`/project/${project.id}`} key={project.id} className="block group">
                <Card className="hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col justify-between border-slate-200 group-hover:border-blue-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{project.name}</CardTitle>
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-full uppercase
                        ${project.status === 'planning' ? 'bg-blue-100 text-blue-800' : 
                          project.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-slate-100 text-slate-800'}`}>
                        {project.status}
                      </span>
                    </div>
                    {project.description && (
                      <CardDescription className="mt-3 text-slate-600 line-clamp-2">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  {/* --- NUEVA ZONA DEL AUTOR --- */}
                  <CardFooter className="bg-slate-50 border-t border-slate-100 py-3 mt-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Círculo con la inicial del nombre */}
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                        {project.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{project.authorName}</span>
                        <span className="text-xs text-slate-500">{project.authorRole}</span>
                      </div>
                    </div>
                  </CardFooter>

                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}