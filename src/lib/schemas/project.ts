import { z } from 'zod'

// 1. Definimos el esquema de validación en tiempo de ejecución
export const projectSchema = z.object({
  name: z.string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
    .max(255, { message: 'El nombre no puede exceder los 255 caracteres.' }),
  description: z.string()
    .optional(), // La descripción no es obligatoria en nuestra DB
  status: z.enum(['planning', 'active', 'completed'])
    .default('planning'),
})

// 2. Extraemos el tipo de TypeScript inferido automáticamente del esquema
// Esto nos salva de tener que escribir una `interface Project` manualmente.
export type ProjectInput = z.infer<typeof projectSchema>