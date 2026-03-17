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

// --- NUEVA ACCIÓN: Alternar el estado de la tarea (Completada / Pendiente) ---
export async function toggleTask(taskId: string, projectId: string, currentStatus: boolean) {
  const supabase = await createClient()

  // Actualizamos la tarea invirtiendo su estado actual (!currentStatus)
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: !currentStatus })
    .eq('id', taskId)

  if (error) console.error("Error al actualizar tarea:", error.message)

  // Refrescamos la pantalla del proyecto
  revalidatePath(`/project/${projectId}`)
}

// --- NUEVA ACCIÓN: Eliminar una tarea ---
export async function deleteTask(taskId: string, projectId: string) {
  const supabase = await createClient()

  // Borramos la tarea que coincida con el ID
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) console.error("Error al borrar tarea:", error.message)

  // Refrescamos la pantalla del proyecto
  revalidatePath(`/project/${projectId}`)
}

// --- NUEVA ACCIÓN: Editar el título de la tarea ---
export async function updateTaskTitle(taskId: string, projectId: string, newTitle: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .update({ title: newTitle })
    .eq('id', taskId)

  if (error) {
    console.error("Error al editar tarea:", error.message)
    return { success: false, message: 'Ocurrió un error al guardar.' }
  }

  // Refrescamos la pantalla para ver el cambio
  revalidatePath(`/project/${projectId}`)
  return { success: true, message: 'Tarea actualizada.' }
}