'use client' 

import { useActionState } from 'react'
import { createProject, type ActionResponse } from '@/actions/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

const initialState: ActionResponse = {
  success: false,
  message: '',
}

export function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(createProject, initialState)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 rounded-t-xl">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Nuevo Proyecto</CardTitle>
        <CardDescription className="text-slate-500">Inicializa un nuevo espacio de trabajo.</CardDescription>
      </CardHeader>
      
      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700 font-semibold">Nombre del Proyecto</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Ej. API de Pagos v2" 
              disabled={isPending} 
              autoComplete="off"
              className="border-slate-300 focus-visible:ring-slate-500"
            />
            {state.errors?.name && (
              <p className="text-sm font-medium text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 font-semibold">Descripción (Opcional)</Label>
            <Input 
              id="description" 
              name="description" 
              placeholder="Objetivo principal..." 
              disabled={isPending} 
              autoComplete="off"
              className="border-slate-300 focus-visible:ring-slate-500"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-4 bg-slate-50 rounded-b-xl pt-6 border-t border-slate-100">
          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={isPending}>
            {isPending ? 'Construyendo...' : 'Crear Proyecto'}
          </Button>

          {state.message && (
            <div className={`p-3 w-full rounded-md text-sm font-medium text-center transition-all ${state.success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {state.message}
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}