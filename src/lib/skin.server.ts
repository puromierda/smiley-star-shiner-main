import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";
import { normalizeSkinAnalysis, SKIN_REFERENCE } from "./skin-guide";
import type { SkinAnalysis } from "./analysis-types";

const PROMPT = `Eres la especialista en cuidado de la piel de "Selem Beauty", con criterio de cosmetóloga experta. Analiza la foto del rostro.
Evalúa solo lo que se observa con claridad: tipo de piel aparente, brillo, poros, textura, deshidratación, rojeces, manchas, líneas finas, imperfecciones y ojeras. No diagnostiques enfermedades; si ves algo que parece requerir un médico (lesiones, acné severo, lunares irregulares), indícalo en medicalNote.

GUÍA DE REFERENCIA (criterio fijo, no inventes categorías ni activos fuera de ella):
${SKIN_REFERENCE}

Primero decide el tipo de piel y entre 1 y 3 categorías de la guía que realmente se ven en la foto; la primera es la principal. Luego arma la rutina siguiendo los activos recomendados de esas categorías y sin usar nada de su lista "Evitar".

Responde SOLO con JSON válido (sin markdown) en español:
{"isFace":boolean,"skinType":"normal"|"seca"|"mixta"|"grasa"|"sensible","categories":["grasa"|"seca"|"mixta"|"sensible"|"acne"|"manchas"],"summary":string,"photoQuality":"buena"|"aceptable"|"baja",
"concerns":[{"name":string,"level":"leve"|"moderado"|"marcado","text":string}],
"mainNeed":{"title":string,"text":string},
"morning":[{"step":string,"product":string,"ingredients":string,"how":string}],
"night":[{"step":string,"product":string,"ingredients":string,"how":string}],
"weekly":[{"step":string,"product":string,"ingredients":string,"how":string}],
"tips":[string],"medicalNote":string|null}
Reglas: 3 a 5 concerns ordenados por importancia; morning 3-5 pasos terminando en protector solar; night 3-5 pasos; weekly 0-2 pasos; product es el tipo de producto (no marcas); ingredients son activos de la guía; 3 tips. Textos claros (máx. 35 palabras cada uno).
Si la foto no muestra un rostro con claridad, pon isFace=false, categories=[], listas vacías y explica cómo repetir la foto en summary.`;

export async function runSkinAnalysis(image: string): Promise<SkinAnalysis> {
  const geminiApiKey = process.env['GEMINI_API_KEY'] || process.env['GOOGLE_GENERATIVE_AI_API_KEY'];
  const lovableApiKey = process.env['LOVABLE_API_KEY'];

  // Si hay API key de Gemini (Google AI Studio)
  if (geminiApiKey) {
    try {
      const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });

      // image es "data:image/jpeg;base64,/9j/..." — extraemos sólo el base64 puro
      const commaIdx = image.indexOf(',');
      const meta = commaIdx > -1 ? image.slice(0, commaIdx) : '';
      const b64 = commaIdx > -1 ? image.slice(commaIdx + 1) : image;
      const mimeType = (meta.match(/data:([^;]+);/) ?? [])[1] ?? 'image/jpeg';

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: PROMPT },
              { type: 'image', image: b64, mimeType: mimeType as `image/${string}` }
            ]
          }
        ]
      });

      const cleaned = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned.slice(cleaned.indexOf('{'), cleaned.lastIndexOf('}') + 1));
      return normalizeSkinAnalysis(parsed);
    } catch (geminiErr) {
      console.error('[skin] Gemini error:', geminiErr instanceof Error ? geminiErr.message : geminiErr);
      // Si no hay Lovable key tampoco, lanzamos el error de Gemini
      if (!lovableApiKey) {
        throw new Error(geminiErr instanceof Error ? geminiErr.message : 'Error al conectar con Gemini. Verifica que GEMINI_API_KEY sea válida.');
      }
      // Si hay Lovable key, dejamos caer al fallback
    }
  }

  // Fallback con Lovable Gateway
  if (!lovableApiKey) {
    throw new Error("Falta configurar la IA. Agrega GEMINI_API_KEY en Netlify.");
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: lovableApiKey,
    headers: { "Lovable-API-Key": lovableApiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let failure: unknown;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    messages: [{ role: "user", content: [{ type: "text", text: PROMPT }, { type: "file", data: image, mediaType: "image/jpeg" }] }],
    onError: ({ error }) => { failure = error; console.error("AI skin error", (error as Error)?.message); },
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "medium", reasoningSummary: "auto", store: false, include: ["reasoning.encrypted_content"] },
    },
  });

  const text = await result.text;
  if (failure || !text) {
    const status = (failure as { statusCode?: number })?.statusCode;
    if (status === 429) throw new Error("Demasiadas solicitudes. Intenta en unos segundos.");
    if (status === 402) throw new Error("Se agotaron los créditos de IA del espacio de trabajo.");
    const msg = failure instanceof Error ? failure.message : typeof failure === 'string' ? failure : '';
    throw new Error(msg ? `Error de IA: ${msg}` : "No pudimos analizar tu piel. Intenta de nuevo.");
  }
  return normalizeSkinAnalysis(JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)));
}
