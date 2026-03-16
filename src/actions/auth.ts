'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AuthResponse = {
  error: string | null;
}

// --- FUNCIÓN DE INICIO DE SESIÓN ---
export async function login(prevState: any, formData: FormData): Promise<AuthResponse> {
  // Extraemos y limpiamos los datos (trim elimina espacios invisibles)
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string

  const supabase = await createClient()

  // Intentamos iniciar sesión
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // Desenmascaramos el error
  if (error) {
    console.error("🔥 ERROR DE SUPABASE AL INICIAR SESIÓN:", error.message)
    return { error: `Error del servidor: ${error.message}` }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// --- FUNCIÓN DE REGISTRO ---
export async function signup(prevState: any, formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// --- FUNCIÓN PARA CERRAR SESIÓN (LA QUE FALTABA) ---
export async function logout() {
  const supabase = await createClient()
  
  // Destruimos la sesión en Supabase y borramos las cookies
  await supabase.auth.signOut()
  
  // Limpiamos la caché y redirigimos al usuario a la página pública
  revalidatePath('/', 'layout')
  redirect('/explore')
}