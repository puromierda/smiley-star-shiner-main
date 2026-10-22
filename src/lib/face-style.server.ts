import { geminiJson, parseJson } from './gemini.server'
import { FACE_REFERENCE, MAKEUP_BY_SKIN, normalizeFaceStyle } from './face-style'

const PROMPT = `Eres la maquilladora y colorista de Selem Beauty. Observa la foto de frente.
No identifiques a la persona ni infieras edad, origen, salud o personalidad.
1) Elige la forma de rostro más parecida de esta guía (usa solo estas claves):
${FACE_REFERENCE}
2) Estima el tipo de piel aparente (normal, seca, mixta, grasa o sensible) y el subtono de piel (cálido, frío, neutro o no determinable si la luz no lo permite).
3) Da 3-5 consejos de maquillaje combinando la técnica de su forma de rostro con la textura adecuada a su tipo de piel. Referencia de texturas: ${JSON.stringify(MAKEUP_BY_SKIN)}.
4) Propón una paleta de 4-6 colores (rubor, labios, sombras, iluminador) que favorezcan su subtono, con hex válido #RRGGBB.
Máximo 30 palabras por texto. Responde en español.
Si no hay un rostro claro de frente, isFace=false y explica en summary cómo repetir la foto.
Responde SOLO con JSON: {"isFace":boolean,"summary":string,"faceShape":"ovalado"|"redondo"|"cuadrado"|"corazon"|"alargado"|"diamante","shapeNote":string,"skinType":string,"undertone":string,"makeup":[string],"palette":[{"name":string,"hex":string,"use":string}]}`

export async function runFaceStyle(image: string) {
  return normalizeFaceStyle(parseJson(await geminiJson(PROMPT, image)))
}
