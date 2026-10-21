import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
] as const;

function isTransientError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("overloaded") ||
    lower.includes("503") ||
    lower.includes("unavailable") ||
    lower.includes("resourceexhausted") ||
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("capacity") ||
    lower.includes("wsarecv") ||
    lower.includes("etimedout") ||
    lower.includes("econnreset") ||
    lower.includes("stream reading error") ||
    lower.includes("fetch failed")
  );
}

function makeTimeoutSignal(ms = 50_000): AbortSignal {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  // Limpieza del temporizador si la señal ya se abortó
  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId), { once: true });
  return controller.signal;
}

export function cleanAndParseJson<T>(rawText: string): T {
  const cleaned = rawText
    .replace(/```json\n?/gi, "")
    .replace(/```/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("La IA no devolvió un formato JSON válido.");
  }
  return JSON.parse(cleaned.slice(start, end + 1)) as T;
}

export async function generateGeminiVisionJson<T>(options: {
  apiKey: string;
  prompt: string;
  imageBase64: string;
  mimeType: string;
}): Promise<T> {
  const { apiKey, prompt, imageBase64, mimeType } = options;
  const google = createGoogleGenerativeAI({ apiKey });

  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    const maxRetriesPerModel = 2;

    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        const { text } = await generateText({
          model: google(modelName),
          abortSignal: makeTimeoutSignal(50_000),
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image",
                  image: imageBase64,
                  mediaType: mimeType,
                },
              ],
            },
          ],
        });

        return cleanAndParseJson<T>(text);
      } catch (err) {
        lastError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[gemini] Modelo ${modelName} intento ${attempt}/${maxRetriesPerModel} falló:`,
          errMsg
        );

        if (!isTransientError(errMsg)) {
          // Si es un error no recuperable (ej. clave inválida o payload rechazado), salimos inmediatamente
          throw err;
        }

        // Si fue el último intento para este modelo, pasamos al siguiente modelo de la lista
        if (attempt < maxRetriesPerModel) {
          // Espera progresiva antes de reintentar el mismo modelo
          await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
        }
      }
    }
    console.warn(`[gemini] Probando siguiente modelo de respaldo tras sobrecarga de ${modelName}...`);
  }

  const finalMsg = lastError instanceof Error ? lastError.message : String(lastError);
  if (isTransientError(finalMsg)) {
    throw new Error(
      "Los servidores de la IA de Google están experimentando alta demanda en este momento. Por favor, vuelve a presionar el botón de escaneo en unos segundos."
    );
  }

  throw lastError ?? new Error("Error desconocido al procesar con Gemini.");
}
