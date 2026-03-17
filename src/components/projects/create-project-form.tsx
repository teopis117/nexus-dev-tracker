'use client'

import { useRef } from 'react'
import { createProject } from '@/actions/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function CreateProjectForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleAction(formData: FormData) {
    const toastId = toast.loading('Construyendo proyecto en la nube...')
    const result = await createProject(null, formData)

    if (result.success) {
      toast.success(result.message, { id: toastId })
      formRef.current?.reset()
    } else {
      toast.error(result.message, { id: toastId })
    }
  }

  return (
    <Card className="border-2 border-slate-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nuevo Proyecto</CardTitle>
        <CardDescription className="dark:text-slate-400">Inicializa un nuevo espacio de trabajo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="dark:text-slate-300">Nombre del Proyecto</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Ej. API de Pagos v2" 
              required 
              className="dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-slate-300">Descripción (Opcional)</Label>
            <Input 
              id="description" 
              name="description" 
              placeholder="Objetivo principal..." 
              className="dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
            />
          </div>
          <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700">
            Crear Proyecto
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}