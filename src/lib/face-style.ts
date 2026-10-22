import { normalizeSkinType, type SkinType } from './skin-guide'

export type FaceShapeKey = 'ovalado' | 'redondo' | 'cuadrado' | 'corazon' | 'alargado' | 'diamante'
export type Swatch = { name: string; hex: string; use: string }

export type FaceShape = {
  key: FaceShapeKey
  name: string
  signs: string
  makeup: string[]
  palette: Swatch[]
}

/** Guía fija de formas de rostro, técnicas de maquillaje y paletas base. */
export const FACE_SHAPES: FaceShape[] = [
  { key: 'ovalado', name: 'Ovalado', signs: 'Frente algo más ancha que el mentón y contorno suave y equilibrado.',
    makeup: ['Contorno muy ligero bajo los pómulos', 'Rubor en la parte alta de la mejilla hacia la sien', 'Cejas con arco suave natural'],
    palette: [{ name: 'Rosa durazno', hex: '#E8A598', use: 'Rubor' }, { name: 'Nude rosado', hex: '#C98B7E', use: 'Labios' }, { name: 'Bronce suave', hex: '#A8735A', use: 'Sombras' }, { name: 'Champán', hex: '#F1D9B5', use: 'Iluminador' }] },
  { key: 'redondo', name: 'Redondo', signs: 'Ancho y largo parecidos, mejillas llenas y mandíbula curva.',
    makeup: ['Contorno en diagonal desde la oreja hacia la boca', 'Rubor en diagonal hacia las sienes', 'Cejas con arco más marcado para alargar'],
    palette: [{ name: 'Malva', hex: '#B9788A', use: 'Rubor' }, { name: 'Rosa viejo', hex: '#B06A72', use: 'Labios' }, { name: 'Taupe', hex: '#8B7768', use: 'Sombras y contorno' }, { name: 'Perla', hex: '#EFE3D6', use: 'Iluminador' }] },
  { key: 'cuadrado', name: 'Cuadrado', signs: 'Frente, pómulos y mandíbula de ancho similar, mandíbula angulosa.',
    makeup: ['Suavizar los ángulos de la mandíbula con contorno difuminado', 'Rubor redondeado en la manzana de la mejilla', 'Cejas curvas, sin ángulos duros'],
    palette: [{ name: 'Coral suave', hex: '#E68A73', use: 'Rubor' }, { name: 'Terracota', hex: '#B5604A', use: 'Labios' }, { name: 'Cobre', hex: '#B07A4F', use: 'Sombras' }, { name: 'Dorado claro', hex: '#E9CF9E', use: 'Iluminador' }] },
  { key: 'corazon', name: 'Corazón', signs: 'Frente y pómulos anchos con mentón estrecho o en punta.',
    makeup: ['Contorno suave en los lados de la frente', 'Rubor bajo el pómulo hacia el centro', 'Iluminar ligeramente el mentón'],
    palette: [{ name: 'Rosa', hex: '#E59AA8', use: 'Rubor' }, { name: 'Frambuesa', hex: '#A8445E', use: 'Labios' }, { name: 'Ciruela suave', hex: '#7E5468', use: 'Sombras' }, { name: 'Rosa perla', hex: '#F3DCE0', use: 'Iluminador' }] },
  { key: 'alargado', name: 'Alargado', signs: 'Rostro claramente más largo que ancho, frente alta.',
    makeup: ['Contorno horizontal en el nacimiento del pelo y el mentón', 'Rubor horizontal en el centro de la mejilla', 'Cejas más rectas para acortar visualmente'],
    palette: [{ name: 'Albaricoque', hex: '#EBA27C', use: 'Rubor' }, { name: 'Rojo ladrillo', hex: '#9E4635', use: 'Labios' }, { name: 'Caramelo', hex: '#B9875A', use: 'Sombras' }, { name: 'Melocotón claro', hex: '#F4D3BC', use: 'Iluminador' }] },
  { key: 'diamante', name: 'Diamante', signs: 'Pómulos anchos y altos con frente y mentón más estrechos.',
    makeup: ['Iluminar la frente y el mentón', 'Contorno suave justo bajo el pómulo', 'Rubor en la manzana de la mejilla, difuminado hacia atrás'],
    palette: [{ name: 'Rosa canela', hex: '#C98478', use: 'Rubor' }, { name: 'Vino', hex: '#7C2F3E', use: 'Labios' }, { name: 'Chocolate', hex: '#6E4A3A', use: 'Sombras' }, { name: 'Oro rosa', hex: '#E7C2AE', use: 'Iluminador' }] },
]

/** Texturas de maquillaje según el tipo de piel (de la guía de piel). */
export const MAKEUP_BY_SKIN: Record<SkinType, string> = {
  normal: 'Base ligera de acabado satinado; casi cualquier textura funciona.',
  seca: 'Prebase hidratante y base cremosa o luminosa; evita polvos en exceso.',
  mixta: 'Base fluida; matifica solo la zona T y deja luminosas las mejillas.',
  grasa: 'Prebase matificante, base oil-free mate y polvo traslúcido en la zona T.',
  sensible: 'Productos sin fragancia y de pocos ingredientes; prueba antes en una zona pequeña.',
}

export type FaceStyleAnalysis = {
  isFace: boolean
  summary: string
  faceShape: FaceShapeKey | null
  shapeNote: string
  skinType: SkinType
  undertone: 'cálido' | 'frío' | 'neutro' | 'no determinable'
  makeup: string[]
  palette: Swatch[]
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const UNDERTONES = ['cálido', 'frío', 'neutro', 'no determinable'] as const

export function normalizeFaceStyle(raw: unknown): FaceStyleAnalysis {
  const o = (raw ?? {}) as Record<string, unknown>
  const key = str(o['faceShape']).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const shape = FACE_SHAPES.find(s => s.key === key) ?? null
  const isFace = o['isFace'] === true
  const undertone = str(o['undertone']).toLowerCase()
  const palette = (Array.isArray(o['palette']) ? o['palette'] : [])
    .map(p => { const s = (p ?? {}) as Record<string, unknown>; return { name: str(s['name']), hex: str(s['hex']), use: str(s['use']) } })
    .filter(p => /^#[0-9a-f]{6}$/i.test(p.hex) && p.name)
    .slice(0, 6)
  const makeup = (Array.isArray(o['makeup']) ? o['makeup'] : []).map(str).filter(Boolean).slice(0, 5)
  if (!isFace) return { isFace, summary: str(o['summary']), faceShape: null, shapeNote: '', skinType: 'normal', undertone: 'no determinable', makeup: [], palette: [] }
  return {
    isFace,
    summary: str(o['summary']),
    faceShape: shape?.key ?? null,
    shapeNote: str(o['shapeNote']),
    skinType: normalizeSkinType(o['skinType']),
    undertone: (UNDERTONES as readonly string[]).includes(undertone) ? (undertone as FaceStyleAnalysis['undertone']) : 'no determinable',
    makeup: makeup.length ? makeup : shape?.makeup ?? [],
    palette: palette.length ? palette : shape?.palette ?? [],
  }
}

export const FACE_REFERENCE = FACE_SHAPES.map(s => `- ${s.key}: ${s.signs} Maquillaje: ${s.makeup.join('; ')}.`).join('\n')
