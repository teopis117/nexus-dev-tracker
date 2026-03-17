import { CreateProjectForm } from '@/components/projects/create-project-form'
import { ProjectList } from '@/components/projects/project-list'
import { JoinProjectForm } from '@/components/projects/join-project-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 md:p-24 transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Sección Superior: El Formulario (Client Component) */}
        <section>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Nexus Dev-Tracker</h1>
            <p className="text-slate-500 mt-2">Centro de Control Arquitectónico</p>
          </div>
          <div className="grid gap-6 w-full max-w-4xl mx-auto md:grid-cols-2">
 <CreateProjectForm />
            <JoinProjectForm />
          </div>
        </section>

        {/* Línea divisoria */}
        <hr className="border-slate-200" />

        {/* Sección Inferior: La Lista (Server Component) */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Proyectos Activos</h2>
          {/* Aquí ocurre la magia de Next.js: Suspense integrado. 
            Este componente se carga en el servidor de forma asíncrona.
          */}
          <ProjectList />
        </section>

      </div>
    </main>
  )
}