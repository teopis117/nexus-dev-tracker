'use server' 
// ^ Esta directiva es vital. Le dice al compilador de Next.js: 
// "Bajo ninguna circunstancia envíes este código al navegador".

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { projectSchema } from '@/lib/schemas/project'

// Definimos un contrato estricto para lo que esta función devolverá al frontend
export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Usamos FormData porque interactuaremos con formularios nativos de HTML
export async function createProject(prevState: any, formData: FormData): Promise<ActionResponse> {
  // 1. Extraer los datos crudos del formulario
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    status: formData.get('status') || 'planning',
  }

  // 2. Validación de Seguridad (Zod)
  // safeParse no "rompe" la app si falla, devuelve un objeto indicando el éxito o error
  const validatedData = projectSchema.safeParse(rawData)

  if (!validatedData.success) {
    // Si los datos son inválidos, devolvemos los errores exactos al frontend
    return {
      success: false,
      message: 'Por favor, corrige los errores en el formulario.',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  // 3. Invocamos nuestro Cliente de Base de Datos
  const supabase = await createClient()

  // 4. Inserción de los datos limpios y validados a Supabase
  const { error } = await supabase
    .from('projects')
    .insert(validatedData.data)

  if (error) {
    console.error('Database Error:', error.message)
    return {
      success: false,
      message: 'Error interno de la base de datos al crear el proyecto.',
    }
  }

  // 5. El Toque Maestro: Revalidación de Caché
  // Le decimos a Next.js que los datos cambiaron, forzándolo a actualizar 
  // la interfaz de usuario de inmediato sin tener que recargar la página.
  revalidatePath('/')

  return {
    success: true,
    message: '¡Proyecto creado con éxito!',
  }
}