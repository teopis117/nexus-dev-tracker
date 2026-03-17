import { createClient } from '@/lib/supabase/server'
import { updateProfile } from '@/actions/profile'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // 1. Identificamos al usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Buscamos su perfil existente (si lo tiene)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-slate-500 hover:text-slate-900">
            ← Volver al Panel
          </Button>
        </Link>

        <Card className="border-2 border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-slate-900">Identidad del Arquitecto</CardTitle>
            <CardDescription className="text-slate-500">
              Personaliza cómo te ven los demás en la red global de Nexus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* Formulario atado a nuestra Server Action */}
            <form action={updateProfile} className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-700">Nombre Completo</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  placeholder="Ej. Ada Lovelace" 
                  // Rellenamos con el dato de la base de datos (o vacío si es nuevo)
                  defaultValue={profile?.full_name || ''} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700">Especialidad / Rol</Label>
                <select 
                  id="role" 
                  name="role" 
                  defaultValue={profile?.role || 'Frontend Developer'}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                >
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full-Stack Engineer">Full-Stack Engineer</option>
                  <option value="Software Architect">Software Architect</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                Guardar Perfil
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </main>
  )
}