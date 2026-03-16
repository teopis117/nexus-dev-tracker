'use client'

import { useActionState, useState } from 'react'
import { login, signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function LoginPage() {
  // Estado para alternar entre Login y Registro
  const [isLogin, setIsLogin] = useState(true)
  
  // Conectamos las Server Actions
  const [state, formAction, isPending] = useActionState(isLogin ? login : signup, { error: null })

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-lg border-slate-200">
        <CardHeader className="space-y-1 bg-slate-50 rounded-t-xl border-b border-slate-100 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {isLogin ? 'Bienvenido a Nexus' : 'Crear Cuenta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? 'Ingresa tus credenciales para acceder al Tracker' : 'Regístrate para comenzar a gestionar proyectos'}
          </CardDescription>
        </CardHeader>
        
        <form action={formAction}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="arquitecto@nexus.com" 
                required 
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isPending}
                minLength={6}
              />
            </div>

            {/* Renderizado de Errores */}
            {state.error && (
              <p className="text-sm font-medium text-red-500 text-center bg-red-50 p-2 rounded-md border border-red-100">
                {state.error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-slate-900 text-white" disabled={isPending}>
              {isPending ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-slate-500 hover:text-slate-900" 
              onClick={() => setIsLogin(!isLogin)}
              disabled={isPending}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}