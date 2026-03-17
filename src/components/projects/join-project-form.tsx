'use client'

import { useRef } from 'react'
import { joinProject } from '@/actions/members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function JoinProjectForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleAction(formData: FormData) {
    const toastId = toast.loading('Verificando código de acceso...')
    const result = await joinProject(formData)

    if (result.success) {
      toast.success(result.message, { id: toastId })
      formRef.current?.reset()
    } else {
      toast.error(result.message, { id: toastId })
    }
  }

  return (
    <Card className="border-2 border-slate-200 shadow-sm bg-white dark:bg-slate-900 dark:border-slate-800 h-full transition-colors">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Unirse a Proyecto</CardTitle>
        <CardDescription className="dark:text-slate-400">Ingresa el código secreto (ID) de tu equipo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleAction} className="space-y-4">
          <div className="space-y-2">
            <Input 
              id="projectId" 
              name="projectId" 
              placeholder="Ej. 123e4567-e89b-12d3..." 
              required 
              className="dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100"
            />
          </div>
          <Button type="submit" variant="outline" className="w-full border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 dark:bg-transparent">
            Solicitar Acceso
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}