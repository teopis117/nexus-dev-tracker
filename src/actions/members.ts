'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function joinProject(formData: FormData) {
  const projectId = formData.get('projectId') as string
  if (!projectId) return { success: false, message: 'El código es requerido' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'No autenticado' }

  // Intentamos registrar al usuario en la tabla intermedia (La lista de invitados)
  const { error } = await supabase
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: user.id,
      role: 'member'
    })

  if (error) {
    console.error("Error al unirse:", error.message)
    return { success: false, message: 'Código inválido o ya eres miembro de este proyecto.' }
  }

  // Refrescamos todo para que el nuevo proyecto aparezca en pantalla
  revalidatePath('/', 'layout')
  return { success: true, message: '¡Te has unido al proyecto exitosamente!' }
}