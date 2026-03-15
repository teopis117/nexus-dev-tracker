import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Obtenemos el almacén de cookies de Next.js
  const cookieStore = await cookies()

  return createServerClient(
    // El '!' al final le promete a TypeScript que estas variables SÍ existen
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Este catch es intencional. 
            // Si intentamos modificar una cookie desde un Server Component 
            // (que es de solo lectura), fallará silenciosamente sin romper la app.
            // El Middleware se encargará de esto más adelante.
          }
        },
      },
    }
  )
}