import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // 1. Verificamos y actualizamos la sesión
  const { supabaseResponse, user } = await updateSession(request)

  // 2. Definimos las reglas de entrada
  // Si NO hay usuario autenticado y NO está intentando acceder a /login...
 if (
    !user && 
    !request.nextUrl.pathname.startsWith('/login') && 
    !request.nextUrl.pathname.startsWith('/explore') &&
    !request.nextUrl.pathname.startsWith('/project')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 3. Si todo está bien, lo dejamos pasar
  return supabaseResponse
}

// 4. Le decimos al Middleware qué rutas vigilar
export const config = {
  matcher: [
    /*
     * Protege todas las rutas EXCEPTO:
     * - Archivos estáticos (_next/static)
     * - Imágenes (_next/image)
     * - Favicon y archivos de diseño (.svg, .png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}