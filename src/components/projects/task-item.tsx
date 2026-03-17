'use client'

// 1. Importamos useOptimistic y startTransition de React
import { useState, useOptimistic, startTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toggleTask, deleteTask, updateTaskTitle } from '@/actions/task'
import { toast } from 'sonner'

export function TaskItem({ task, projectId, isOwner }: { task: any, projectId: string, isOwner: boolean }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(task.title)

  // --- LA MAGIA OPTIMISTA ---
  // Creamos una "copia" de la tarea que podemos modificar instantáneamente
  const [optimisticTask, toggleOptimisticTask] = useOptimistic(
    task,
    // Cuando llamemos a esta función, invertirá el estado actual en 0 milisegundos
    (state, newStatus: boolean) => ({ ...state, is_completed: newStatus })
  )

  // 2. EL INTERCEPTOR: Engañamos al ojo humano
  const handleToggle = async () => {
    // A. Actualizamos la pantalla instantáneamente sin esperar al servidor
    startTransition(() => {
      toggleOptimisticTask(!optimisticTask.is_completed)
    })
    
    // B. Mandamos la petición real al servidor (Supabase) en segundo plano
    await toggleTask(task.id, projectId, task.is_completed)
  }

  const handleUpdate = async () => {
    if (newTitle.trim() === '') return toast.error('El nombre no puede estar vacío')
    
    const toastId = toast.loading('Actualizando tarea...')
    const result = await updateTaskTitle(task.id, projectId, newTitle)
    
    if (result.success) {
      toast.success('Tarea actualizada con éxito', { id: toastId })
      setIsEditing(false)
    } else {
      toast.error('Error al actualizar', { id: toastId })
    }
  }

  return (
    // OJO: De ahora en adelante usamos 'optimisticTask' en vez de 'task' para dibujar la UI
    <Card className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 
      ${optimisticTask.is_completed ? 'bg-slate-50 dark:bg-slate-900/50 opacity-75' : 'hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 dark:border-slate-800'}`}>
      
      <div className="flex items-center gap-3 w-full">
        
        {/* Cambiamos la acción directa por nuestro nuevo interceptor optimista */}
        <form action={handleToggle}>
          <button type="submit" className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors 
            ${optimisticTask.is_completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600 hover:border-slate-500 dark:hover:border-slate-400'}`}>
            {optimisticTask.is_completed && <span className="text-white text-xs font-bold">✓</span>}
          </button>
        </form>

        {isEditing ? (
          <div className="flex w-full gap-2">
            <Input 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-8 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              autoFocus
            />
            <Button size="sm" onClick={handleUpdate} className="h-8 bg-blue-600 hover:bg-blue-700 text-white">Guardar</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</Button>
          </div>
        ) : (
          <span className={`font-medium truncate transition-all duration-200 
            ${optimisticTask.is_completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
            {task.title}
          </span>
        )}
      </div>

      {!isEditing && isOwner && (
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Editar
          </Button>
          <form action={deleteTask.bind(null, task.id, projectId)}>
            <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              Borrar
            </Button>
          </form>
        </div>
      )}
    </Card>
  )
}