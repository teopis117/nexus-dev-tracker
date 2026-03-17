'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(prevState: any, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name || name.length < 3) {
    return { success: false, message: 'El nombre debe tener al menos 3 caracteres.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Debes iniciar sesión.' }
  }

  // --- NUEVA LÓGICA DE NEGOCIO: CONTADOR DE LÍMITES SAAS ---
  const { count, error: countError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true }) // head: true hace que sea súper rápido, solo cuenta, no trae datos
    .eq('user_id', user.id)

  // Si el usuario ya tiene 3 o más proyectos, le bloqueamos el paso con un mensaje de venta
  if (count !== null && count >= 3) {
    return { 
      success: false, 
      message: '🛑 Límite gratuito alcanzado (3/3). ¡Actualiza a Nexus Pro para proyectos ilimitados!' 
    }
  }
  // -----------------------------------------------------------

  const { error } = await supabase
    .from('projects')
    .insert({
      name,
      description,
      user_id: user.id,
      status: 'planning'
    })

  if (error) {
    console.error('Error al crear proyecto:', error.message)
    return { success: false, message: 'Error en el servidor al crear el proyecto.' }
  }

  revalidatePath('/')
  return { success: true, message: '¡Proyecto creado con éxito!' }
}