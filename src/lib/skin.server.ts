import { geminiJson, parseJson } from "./gemini.server";
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
  const text = await geminiJson(PROMPT, image);
  return normalizeSkinAnalysis(parseJson(text) as Parameters<typeof normalizeSkinAnalysis>[0]);
}
