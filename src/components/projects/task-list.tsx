'use client'

import { useState } from 'react'
import { TaskItem } from './task-item'

export function TaskList({ tasks, projectId, isOwner }: { tasks: any[], projectId: string, isOwner: boolean }) {
  // Estado para saber qué pestaña está seleccionada
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  // Filtramos la lista de tareas en tiempo real según el botón presionado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.is_completed
    if (filter === 'completed') return task.is_completed
    return true // Si es 'all', devolvemos todas
  })

  // Contadores para las "burbujas" de notificación en las pestañas
  const pendingCount = tasks.filter(t => !t.is_completed).length
  const completedCount = tasks.filter(t => t.is_completed).length

  return (
    <div className="space-y-6">
      
      {/* --- EL SELECTOR DE PESTAÑAS (TABS) --- */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg w-full sm:w-fit border border-slate-200 dark:border-slate-800">
        
        <button 
          onClick={() => setFilter('all')}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all 
            ${filter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Todas ({tasks.length})
        </button>
        
        <button 
          onClick={() => setFilter('pending')}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all 
            ${filter === 'pending' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Pendientes ({pendingCount})
        </button>
        
        <button 
          onClick={() => setFilter('completed')}
          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all 
            ${filter === 'completed' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Completadas ({completedCount})
        </button>
        
      </div>

      {/* --- LA LISTA DE TAREAS FILTRADA --- */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
            {filter === 'completed' ? 'Aún no hay tareas completadas. ¡A trabajar!' : 
             filter === 'pending' ? '¡Felicidades! No tienes tareas pendientes.' : 
             'El tablero está limpio. ¡Añade tu primera tarea!'}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              projectId={projectId} 
              isOwner={isOwner} 
            />
          ))
        )}
      </div>

    </div>
  )
}