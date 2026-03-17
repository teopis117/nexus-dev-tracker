'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  // 1. Extraemos los datos del formulario
  const fullName = formData.get('full_name') as string
  const role = formData.get('role') as string

  const supabase = await createClient()
  
  // 2. Verificamos quién está intentando hacer esto
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  // 3. Magia SQL: El Upsert
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id, // Forzamos a que el perfil le pertenezca a este usuario
      full_name: fullName,
      role: role
    })

  if (error) {
    console.error("Error guardando perfil:", error.message)
    return
  }

  // 4. Refrescamos las rutas para que el nuevo nombre aparezca inmediatamente
  revalidatePath('/profile')
  revalidatePath('/', 'layout') 
}