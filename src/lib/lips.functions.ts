import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { z } from 'zod'

export const analyzeLips = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator((data) => z.object({ image: z.string().startsWith('data:image/').max(8_000_000) }).parse(data))
  .handler(async ({ data }) => {
    const { runLipAnalysis } = await import('./lips.server')
    try {
      return { ok: true as const, analysis: await runLipAnalysis(data.image) }
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'No se pudo analizar la foto.' }
    }
  })