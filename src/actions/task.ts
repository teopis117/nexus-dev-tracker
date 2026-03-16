'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// La Server Action recibe el ID del proyecto y los datos del formulario
export async function createTask(projectId: string, formData: FormData) {
  const title = formData.get('title') as string
  
  if (!title || title.trim() === '') return

  const supabase = await createClient()

  // Insertamos la tarea relacionalmente
  const { error } = await supabase.from('tasks').insert({
    title,
    project_id: projectId
  })

  if (error) {
    console.error("Error creando tarea:", error.message)
    return
  }

  // Refrescamos SOLO la página dinámica de este proyecto
  revalidatePath(`/project/${projectId}`)
}