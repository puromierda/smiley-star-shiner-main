const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"];

/** Calls Google Gemini directly with the project's own free key; returns the model's JSON text. */
export async function geminiJson(prompt: string, image: string): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("Falta configurar la clave de Google Gemini.");
  const match = image.match(/^data:(image\/[\w.+-]+);base64,(.+)$/);
  if (!match) throw new Error("La foto no es válida.");
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }, { inline_data: { mime_type: match[1], data: match[2] } }] }],
    generationConfig: { responseMimeType: "application/json" },
  });
  let lastStatus = 0;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 1; attempt++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body,
      });
      if (res.ok) {
        const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
        const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
        if (!text) throw new Error("La IA no devolvió resultado. Intenta con otra foto.");
        return text;
      }
      lastStatus = res.status;
      console.error("Gemini error", model, res.status, (await res.text()).slice(0, 300));
      if (res.status !== 429 && res.status !== 503 && res.status < 500) break;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  if (lastStatus === 400 || lastStatus === 401 || lastStatus === 403) throw new Error("La clave de Google Gemini no es válida.");
  if (lastStatus === 429) throw new Error("Se alcanzó el límite gratuito de Gemini. Intenta en un minuto.");
  throw new Error("Gemini está saturado en este momento. Intenta de nuevo en unos segundos.");
}

export function parseJson(text: string): unknown {
  return JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
}
