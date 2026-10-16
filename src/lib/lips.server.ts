import { createOpenAI } from '@ai-sdk/openai'
import { APICallError, Output, streamText } from 'ai'
import { createLovableAiGatewayRunIdFetch } from './run-id.server.ts'
import { lipAnalysisSchema, normalizeLipAnalysis, LIP_CARE_STEPS, LIP_CARE_AVOID } from './lip-analysis'

const INSTRUCTIONS = `Eres la especialista en cuidado de labios de Selem Beauty. Observa esta foto de frente y ofrece una rutina natural de cuidado SIN maquillaje para unos labios hidratados, suaves y de aspecto más terso, respetando la forma aparente del rostro y sus proporciones.
No identifiques a la persona ni infieras edad, origen, salud o personalidad. No diagnostiques ni recomiendes rellenos, inyecciones, cirugía, irritantes, succión o remedios caseros. No prometas aumento real ni resultados garantizados.
Describe faceShape y lipShape solo si se distinguen; si la perspectiva no permite verlo, di que no se puede determinar con esta foto. balance describe las proporciones observables con respeto y explica que hidratar puede mejorar el aspecto, pero no modifica la forma ni aporta volumen permanente. No diagnostiques sequedad u otras condiciones basándote solo en una foto.
No recomiendes maquillaje, delineadores, labiales de color, brillo, rellenos, succión, ejercicios para aumentar volumen, exfoliación ni ingredientes irritantes aunque sean naturales. No sugieras que natural equivale a seguro. No prometas aumento real de volumen.
Usa exclusivamente estos pasos de cuidado: ${JSON.stringify(LIP_CARE_STEPS)}. Prácticas a evitar: ${JSON.stringify(LIP_CARE_AVOID)}. Devuelve colors=[] siempre. Personaliza únicamente summary, faceShape, lipShape y balance según lo visible. Máximo 35 palabras por texto personalizado. Responde en español.
Si no hay un rostro con los labios claramente visibles, isFace=false, explica cómo repetir la foto en summary y devuelve los demás textos vacíos y listas vacías.`

export async function runLipAnalysis(image: string) {
  const apiKey = process.env['LOVABLE_API_KEY']
  if (!apiKey) throw new Error('Falta configurar la IA.')
  const runIdFetch = createLovableAiGatewayRunIdFetch()
  const provider = createOpenAI({
    baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey,
    headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    fetch: runIdFetch.fetch,
  })
  let failure: unknown
  const result = streamText({
    model: provider.responses('openai/gpt-6-astra'),
    instructions: INSTRUCTIONS,
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Recomienda un cuidado natural de labios sin maquillaje según este rostro, sin prometer aumento real de volumen.' }, { type: 'image', image: new URL(image) }] }],
    output: Output.object({ schema: lipAnalysisSchema }),
    maxRetries: 0,
    onError: ({ error }) => { failure = error },
    providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'low', reasoningSummary: 'auto', store: false, include: ['reasoning.encrypted_content'] } },
  })
  try {
    const output = await result.output
    if (failure) throw failure
    return normalizeLipAnalysis(output)
  } catch (error) {
    const cause = failure ?? error
    if (APICallError.isInstance(cause)) {
      let message = cause.message
      try {
        const body = JSON.parse(cause.responseBody ?? '{}')
        message = body.message ?? body.error?.message ?? message
      } catch { /* Keep the provider's error message. */ }
      throw new Error(message)
    }
    throw new Error('No se pudo completar el análisis de labios. No se generaron recomendaciones.')
  }
}