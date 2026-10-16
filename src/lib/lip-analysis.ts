import { z } from 'zod'

export const lipAnalysisSchema = z.object({
  isFace: z.boolean(),
  summary: z.string(),
  faceShape: z.string(),
  lipShape: z.string(),
  balance: z.string(),
  steps: z.array(z.object({ title: z.string(), product: z.string(), how: z.string() }).strict()),
  colors: z.array(z.object({ name: z.string(), reason: z.string() }).strict()),
  avoid: z.array(z.string()),
}).strict()

export type LipAnalysis = z.infer<typeof lipAnalysisSchema>

export const LIP_CARE_STEPS: LipAnalysis['steps'] = [
  { title: 'Por la mañana · hidratar', product: 'Bálsamo sin perfume ni color', how: 'Aplica una capa fina sobre los labios limpios. Repite cuando notes sequedad; unos labios hidratados pueden verse más suaves y tersos, sin aumentar su volumen real.' },
  { title: 'Durante el día · proteger', product: 'Protector labial SPF 30 o superior', how: 'Úsalo al salir y reaplica cada dos horas al aire libre y después de comer o beber. Evita lamer o morder los labios.' },
  { title: 'Por la noche · conservar la humedad', product: 'Vaselina pura sin perfume', how: 'Con los labios ligeramente húmedos, aplica una capa fina antes de dormir. No frotes ni retires las pieles sueltas.' },
]

export const LIP_CARE_AVOID = [
  'Canela, chile, mentol, limón y aceites esenciales: pueden irritar; la hinchazón no es un aumento saludable de volumen.',
  'Succión, cepillado, exfoliantes de azúcar y masajes intensos: pueden lesionar los labios y no aportan volumen permanente.',
  'Si aparecen dolor, grietas persistentes o hinchazón repentina, suspende el producto y consulta a un profesional.',
]

export function normalizeLipAnalysis(value: unknown): LipAnalysis {
  const result = lipAnalysisSchema.parse(value)
  if (!result.isFace) return { ...result, faceShape: '', lipShape: '', balance: '', steps: [], colors: [], avoid: [] }
  return { ...result, steps: LIP_CARE_STEPS.map(step => ({ ...step })), colors: [], avoid: [...LIP_CARE_AVOID] }
}