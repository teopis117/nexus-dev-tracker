import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

// Es un Server Component, por lo que puede consultar a la base de datos directamente
export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logotipo / Marca */}
        <Link href={user ? "/" : "/explore"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:inline-block">
            Nexus Tracker
          </span>
        </Link>

        {/* Enlaces de Navegación */}
        <div className="flex items-center gap-4">
          <Link href="/explore" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Explorar
          </Link>
          
          {user ? (
            /* Si HAY usuario autenticado */
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4 ml-2">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Mi Panel
              </Link>
              <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          ) : (
            /* Si NO hay usuario autenticado */
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4 ml-2">
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-slate-900 text-white">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}