'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// 1. Definimos las reglas de validación
const projectSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
})

export type ActionResponse = {
  success: boolean
  message: string
  errors?: {
    [key: string]: string[]
  }
}

export async function createProject(prevState: any, formData: FormData): Promise<ActionResponse> {
  // 2. Extraemos los datos del formulario (¡Aquí está el rawData que faltaba!)
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
  }

  // 3. Validamos los datos con Zod
  const validatedData = projectSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Por favor, corrige los errores del formulario.',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  // 4. Obtenemos al usuario autenticado de forma segura en el servidor
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'Acceso denegado. Usuario no autenticado.' }
  }

  // 5. Inserción en la base de datos, incluyendo la firma del dueño (user_id)
  const { error } = await supabase
    .from('projects')
    .insert({
      name: validatedData.data.name,
      description: validatedData.data.description,
      status: 'planning', // Estado inicial por defecto
      user_id: user.id    // <-- LA FIRMA DEL DUEÑO
    })

  if (error) {
    console.error("Error en Supabase:", error.message)
    return {
      success: false,
      message: 'Ocurrió un error al guardar en la base de datos.',
    }
  }

  // 6. Refrescamos la página principal para ver el nuevo proyecto
  revalidatePath('/', 'layout')
  
  return {
    success: true,
    message: 'Proyecto creado con éxito.',
  }
}