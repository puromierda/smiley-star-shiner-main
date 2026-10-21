import { createOpenAI } from '@ai-sdk/openai'
import { APICallError, Output, streamText } from 'ai'
import { createLovableAiGatewayRunIdFetch } from './run-id.server.ts'
import { lipAnalysisSchema, normalizeLipAnalysis, LIP_CARE_STEPS, LIP_CARE_AVOID } from './lip-analysis'
import { generateGeminiVisionJson } from './gemini-client.server'

const INSTRUCTIONS = `Eres la especialista en cuidado de labios de Selem Beauty. Observa esta foto de frente y ofrece una rutina natural de cuidado SIN maquillaje para unos labios hidratados, suaves y de aspecto más terso, respetando la forma aparente del rostro y sus proporciones.
No identifiques a la persona ni infieras edad, origen, salud o personalidad. No diagnostiques ni recomiendes rellenos, inyecciones, cirugía, irritantes, succión o remedios caseros. No prometas aumento real ni resultados garantizados.
Describe faceShape y lipShape solo si se distinguen; si la perspectiva no permite verlo, di que no se puede determinar con esta foto. balance describe las proporciones observables con respeto y explica que hidratar puede mejorar el aspecto, pero no modifica la forma ni aporta volumen permanente. No diagnostiques sequedad u otras condiciones basándote solo en una foto.
No recomiendes maquillaje, delineadores, labiales de color, brillo, rellenos, succión, ejercicios para aumentar volumen, exfoliación ni ingredientes irritantes aunque sean naturales. No sugieras que natural equivale a seguro. No prometas aumento real de volumen.
Usa exclusivamente estos pasos de cuidado: ${JSON.stringify(LIP_CARE_STEPS)}. Prácticas a evitar: ${JSON.stringify(LIP_CARE_AVOID)}. Devuelve colors=[] siempre. Personaliza únicamente summary, faceShape, lipShape y balance según lo visible. Máximo 35 palabras por texto personalizado. Responde en español.
Si no hay un rostro con los labios claramente visibles, isFace=false, explica cómo repetir la foto en summary y devuelve los demás textos vacíos y listas vacías.`

export async function runLipAnalysis(image: string) {
  const geminiApiKey = process.env['GEMINI_API_KEY'] || process.env['GOOGLE_GENERATIVE_AI_API_KEY']
  const lovableApiKey = process.env['LOVABLE_API_KEY']

  if (geminiApiKey) {
    try {
      // image es "data:image/jpeg;base64,..." — extraemos sólo el base64 puro
      const commaIdx = image.indexOf(',')
      const meta = commaIdx > -1 ? image.slice(0, commaIdx) : ''
      const b64 = commaIdx > -1 ? image.slice(commaIdx + 1) : image
      const mimeType = (meta.match(/data:([^;]+);/) ?? [])[1] ?? 'image/jpeg'

      const parsed = await generateGeminiVisionJson<unknown>({
        apiKey: geminiApiKey,
        prompt: `${INSTRUCTIONS}\n\nResponde estrictamente con un JSON con el siguiente formato:\n{"isFace":boolean,"summary":string,"faceShape":string,"lipShape":string,"balance":string,"steps":[],"colors":[],"avoid":[]}`,
        imageBase64: b64,
        mimeType,
      })

      return normalizeLipAnalysis(parsed)
    } catch (geminiErr) {
      console.error('[lips] Gemini error:', geminiErr instanceof Error ? geminiErr.message : geminiErr)
      const lovableApiKey2 = process.env['LOVABLE_API_KEY']
      if (!lovableApiKey2) {
        throw geminiErr
      }
      // Si hay Lovable key, dejamos caer al fallback
    }
  }

  if (!lovableApiKey) {
    throw new Error('Falta configurar la IA. Agrega GEMINI_API_KEY en las variables de entorno.')
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch()
  const provider = createOpenAI({
    baseURL: 'https://ai.gateway.lovable.dev/v1', apiKey: lovableApiKey,
    headers: { 'Lovable-API-Key': lovableApiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    fetch: runIdFetch.fetch,
  })
  let failure: unknown
  const fbCommaIdx = image.indexOf(',')
  const fbMimeType = (image.slice(0, fbCommaIdx).match(/data:([^;]+);/) ?? [])[1] ?? 'image/jpeg'
  const fbB64 = fbCommaIdx > -1 ? image.slice(fbCommaIdx + 1) : image
  const result = streamText({
    model: provider.responses('openai/gpt-6-astra'),
    instructions: INSTRUCTIONS,
    messages: [{ role: 'user', content: [{ type: 'text', text: 'Recomienda un cuidado natural de labios sin maquillaje según este rostro, sin prometer aumento real de volumen.' }, { type: 'image', image: fbB64, mediaType: fbMimeType }] }],
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