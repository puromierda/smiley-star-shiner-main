import type { RoutineStep, SkinAnalysis } from './analysis-types'

export const SKIN_TYPES = ['normal', 'seca', 'mixta', 'grasa', 'sensible'] as const
export type SkinType = (typeof SKIN_TYPES)[number]

export type CategoryKey = 'grasa' | 'seca' | 'mixta' | 'sensible' | 'acne' | 'manchas'

export type SkinCategory = {
  key: CategoryKey
  name: string
  tagline: string
  signs: string[]
  actives: string[]
  avoid: string[]
  routine: { morning: RoutineStep[]; night: RoutineStep[]; weekly: RoutineStep[] }
}

/**
 * Guía de referencia fija: taxonomía de tipos de piel, señales visibles,
 * activos recomendados y contraindicaciones. Sirve de base para las rutinas
 * que se muestran sin escanear y para el criterio que sigue el análisis con IA.
 */
export const SKIN_CATEGORIES: SkinCategory[] = [
  {
    key: 'grasa',
    name: 'Piel grasa',
    tagline: 'Brillo rápido, poros marcados y tendencia a imperfecciones.',
    signs: [
      'Brillo en frente, nariz y mentón a los pocos minutos de lavarse',
      'Poros visibles o dilatados en la zona T',
      'Textura irregular y puntos negros',
      'El maquillaje se desliza durante el día',
    ],
    actives: ['Niacinamida 5-10%', 'Ácido salicílico (BHA) 0,5-2%', 'Zinc PCA', 'Retinaldehído', 'Ácido azelaico 10%', 'Arcilla caolín'],
    avoid: ['Alcohol denat.', 'Aceites pesados (coco, manteca de karité pura)', 'Jabones en barra muy alcalinos', 'Exfoliantes de gránulos', 'Lavar la cara más de dos veces'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Gel limpiador suave', ingredients: 'Ácido salicílico 0,5% o zinc', how: 'Masajea 30 segundos con agua tibia y seca sin frotar.' },
        { step: 'Equilibrar', product: 'Sérum seborregulador', ingredients: 'Niacinamida 10%, zinc PCA', how: 'Aplica 3-4 gotas sobre la piel ligeramente húmeda.' },
        { step: 'Hidratar', product: 'Gel-crema sin aceite', ingredients: 'Ácido hialurónico, pantenol', how: 'Capa fina en todo el rostro, sin cargar la zona T.' },
        { step: 'Proteger', product: 'Protector solar fluido FPS 50', ingredients: 'Filtros mates, niacinamida', how: 'Dos dedos de producto; reaplica cada 3-4 horas.' },
      ],
      night: [
        { step: 'Doble limpieza', product: 'Aceite ligero + gel', ingredients: 'Aceite de jojoba, tensioactivos suaves', how: 'Retira el protector solar y luego lava con el gel.' },
        { step: 'Tratar', product: 'Sérum de retinaldehído', ingredients: 'Retinaldehído 0,05-0,1%', how: 'Empieza 2 noches por semana y sube según tolerancia.' },
        { step: 'Imperfecciones', product: 'Tratamiento local', ingredients: 'Ácido salicílico 2%', how: 'Solo sobre granos y puntos negros, no en todo el rostro.' },
        { step: 'Hidratar', product: 'Gel-crema reparador', ingredients: 'Ceramidas, pantenol', how: 'Sellando el tratamiento para no dañar la barrera.' },
      ],
      weekly: [
        { step: 'Purificar', product: 'Mascarilla de arcilla', ingredients: 'Caolín, zinc', how: '10 minutos, solo en la zona T, 1 vez por semana.' },
        { step: 'Renovar', product: 'Peeling químico suave', ingredients: 'BHA 2% + AHA mandélico', how: 'Una noche al semana, sin mezclarlo con retinoides.' },
      ],
    },
  },
  {
    key: 'seca',
    name: 'Piel seca',
    tagline: 'Tirantez, descamación fina y falta de confort.',
    signs: [
      'Sensación de tirantez después de lavar',
      'Descamación o pellejitos en mejillas y contorno',
      'Aspecto opaco y poros casi invisibles',
      'Líneas finas que aparecen al sonreír (deshidratación)',
    ],
    actives: ['Ácido hialurónico', 'Ceramidas', 'Glicerina', 'Escualano', 'Pantenol', 'Urea 5%'],
    avoid: ['Alcohol denat.', 'Sulfatos fuertes (SLS)', 'Agua muy caliente', 'Exfoliantes abrasivos', 'Retinoides potentes sin amortiguar'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Leche o crema limpiadora', ingredients: 'Glicerina, pantenol', how: 'Lava con las manos y agua tibia, sin esponja.' },
        { step: 'Hidratar', product: 'Sérum humectante', ingredients: 'Ácido hialurónico, poliglutamato', how: 'Sobre la piel húmeda para retener el agua.' },
        { step: 'Nutrir', product: 'Crema rica', ingredients: 'Ceramidas, escualano, manteca de karité', how: 'Masajea hasta que desaparezca la sensación de tirantez.' },
        { step: 'Proteger', product: 'Protector solar cremoso FPS 50', ingredients: 'Filtros hidratantes, vitamina E', how: 'Dos dedos; reaplica si pasas frente al sol.' },
      ],
      night: [
        { step: 'Disolver', product: 'Aceite o bálsamo limpiador', ingredients: 'Aceite de almendras, girasol', how: 'Retira el solar con movimientos suaves.' },
        { step: 'Limpiar', product: 'Limpiador sin jabón', ingredients: 'Avena coloidal', how: 'Apenas 20 segundos para no despojar la piel.' },
        { step: 'Reparar', product: 'Sérum calmante', ingredients: 'Pantenol, centella asiática', how: 'Antes de la crema, sobre la piel algo húmeda.' },
        { step: 'Sellar', product: 'Crema nutritiva + bálsamo', ingredients: 'Ceramidas, manteca de karité, urea 5%', how: 'Bálsamo extra en zonas que descaman.' },
      ],
      weekly: [
        { step: 'Mascarilla', product: 'Mascarilla cremosa hidratante', ingredients: 'Ácido hialurónico, ceramidas', how: '15 minutos una o dos veces por semana.' },
        { step: 'Suavizar', product: 'Exfoliación enzimática', ingredients: 'Enzimas de papaya, AHA láctico', how: '5 minutos, una vez por semana, sin frotar.' },
      ],
    },
  },
  {
    key: 'mixta',
    name: 'Piel mixta',
    tagline: 'Zona T con brillo y mejillas normales o secas.',
    signs: [
      'Brillo en frente, nariz y mentón',
      'Mejillas normales, tirantes o con descamación',
      'Poros marcados solo en la zona T',
      'Imperfecciones que aparecen y desaparecen por zonas',
    ],
    actives: ['Niacinamida', 'Ácido mandélico', 'Ácido hialurónico', 'PHA', 'Retinol en baja concentración', 'Zinc'],
    avoid: ['Astringentes agresivos en las mejillas', 'Cremas muy oclusivas en la zona T', 'Exfoliar en exceso la zona seca', 'Alcohol en tónicos'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Gel-espuma suave', ingredients: 'Tensioactivos sin sulfatos', how: 'Insiste en la zona T y suaviza en las mejillas.' },
        { step: 'Equilibrar', product: 'Sérum ligero', ingredients: 'Niacinamida, ácido hialurónico', how: 'Todo el rostro; regula sin resecar.' },
        { step: 'Hidratar', product: 'Emulsión ligera', ingredients: 'Escualano, ceramidas', how: 'Capa fina; refuerza solo donde tira.' },
        { step: 'Proteger', product: 'Protector solar fluido FPS 50', ingredients: 'Textura fluida no grasa', how: 'Dos dedos y reaplica a media mañana.' },
      ],
      night: [
        { step: 'Limpiar', product: 'Limpiador suave o doble limpieza', ingredients: 'Aceite ligero + gel sin sulfatos', how: 'Retira el solar y limpia sin resecar.' },
        { step: 'Tratar', product: 'Sérum renovador', ingredients: 'Retinol 0,25% o mandélico', how: '2-3 noches por semana, priorizando la zona T.' },
        { step: 'Hidratar', product: 'Crema de textura media', ingredients: 'Ceramidas, pantenol', how: 'Más cantidad en mejillas, menos en nariz y frente.' },
      ],
      weekly: [
        { step: 'Multi-mascarilla', product: 'Arcilla + hidratante', ingredients: 'Caolín en zona T, aloe en mejillas', how: '10 minutos, una vez por semana.' },
        { step: 'Renovar', product: 'Exfoliante químico suave', ingredients: 'PHA o mandélico', how: 'Una noche, evitando las zonas irritadas.' },
      ],
    },
  },
  {
    key: 'sensible',
    name: 'Piel sensible',
    tagline: 'Se enrojece y reacciona con facilidad.',
    signs: [
      'Rojeces que aparecen con facilidad o calor',
      'Ardor o picor al aplicar productos nuevos',
      'Capilares visibles o rubor en mejillas y nariz',
      'Reacción a fragancias o a exfoliantes',
    ],
    actives: ['Centella asiática (madecassoside)', 'Pantenol', 'Alantoína', 'Avena coloidal', 'Ceramidas', 'Ácido azelaico 10%'],
    avoid: ['Fragancia y aceites esenciales', 'Alcohol denat.', 'Exfoliantes abrasivos', 'Retinoides potentes', 'Vitamina C muy ácida sin adaptar'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Limpiador sin jabón', ingredients: 'Avena coloidal, glicerina', how: 'Agua tibia y secado a toquecitos, sin frotar.' },
        { step: 'Calmar', product: 'Sérum calmante', ingredients: 'Centella asiática, pantenol', how: 'Aplica con las palmas, sin arrastrar la piel.' },
        { step: 'Reforzar', product: 'Crema de barrera', ingredients: 'Ceramidas, alantoína', how: 'Capa generosa en las zonas que se enrojecen.' },
        { step: 'Proteger', product: 'Protector solar mineral FPS 50', ingredients: 'Óxido de zinc', how: 'Dos dedos; el mineral suele tolerarse mejor.' },
      ],
      night: [
        { step: 'Limpiar', product: 'Leche limpiadora suave', ingredients: 'Sin fragancia, sin alcohol', how: 'Retira el solar sin frotar ni usar agua caliente.' },
        { step: 'Calmar', product: 'Sérum antirrojeces', ingredients: 'Centella, azelaico 10%', how: 'Introduce un activo nuevo cada 2 semanas.' },
        { step: 'Reparar', product: 'Crema nutritiva', ingredients: 'Ceramidas, manteca de karité', how: 'Sella la hidratación para dormir.' },
        { step: 'Bálsamo', product: 'Bálsamo reparador', ingredients: 'Pantenol, alantoína', how: 'Solo donde notes tirantez o irritación.' },
      ],
      weekly: [
        { step: 'Calmar', product: 'Mascarilla hidratante sin perfume', ingredients: 'Avena, aloe', how: 'Una vez por semana; no exfolies en seco.' },
      ],
    },
  },
  {
    key: 'acne',
    name: 'Con acné',
    tagline: 'Brotes, granos y marcas que tardan en irse.',
    signs: [
      'Granitos rojos, pústulas o puntos blancos',
      'Puntos negros en nariz y mentón',
      'Brotes que se repiten en zona T, mandíbula o mentón',
      'Marcas rojas o pardas que duran semanas',
    ],
    actives: ['Ácido salicílico 2%', 'Niacinamida', 'Peróxido de benzoilo 2,5-5%', 'Ácido azelaico 10-15%', 'Retinoide', 'Zinc'],
    avoid: ['Apretar los granos', 'Aceites comedogénicos', 'Toallas o fundas sucias', 'Tratamientos muy agresivos que dañan la barrera', 'Alcohol en tónicos'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Limpiador suave', ingredients: 'Sin sulfatos, pH equilibrado', how: 'No uses cepillos ni esponjas sobre los brotes.' },
        { step: 'Tratar', product: 'Sérum antiimperfecciones', ingredients: 'Ácido salicílico 2%, niacinamida', how: 'En las zonas con brotes, no solo sobre el grano.' },
        { step: 'Hidratar', product: 'Gel-crema no comedogénico', ingredients: 'Ácido hialurónico, pantenol', how: 'Aunque brille, la barrera necesita hidratación.' },
        { step: 'Proteger', product: 'Protector solar FPS 50 oil-free', ingredients: 'Textura fluida', how: 'Evita que las marcas del acné se oscurezcan.' },
      ],
      night: [
        { step: 'Limpiar', product: 'Doble limpieza suave', ingredients: 'Aceite ligero + gel', how: 'El aceite no agrava el acné si aclaras bien.' },
        { step: 'Tratar', product: 'Ácido azelaico o retinoide', ingredients: 'Azelaico 15% o adapaleno', how: 'Empieza 3 noches por semana y sube despacio.' },
        { step: 'Reparar', product: 'Crema ligera de barrera', ingredients: 'Ceramidas, pantenol', how: 'Reduce la irritación del tratamiento.' },
      ],
      weekly: [
        { step: 'Purificar', product: 'Mascarilla de arcilla', ingredients: 'Caolín, zinc', how: '10 minutos, una vez por semana.' },
        { step: 'Renovar', product: 'Peeling suave', ingredients: 'Mandélico o BHA', how: 'Evita exfoliar sobre granos abiertos.' },
      ],
    },
  },
  {
    key: 'manchas',
    name: 'Con manchas',
    tagline: 'Tono irregular, marcas oscuras o sol.',
    signs: [
      'Zonas más oscuras en mejillas, frente o labio superior',
      'Marcas que deja el acné, más oscuras con el sol',
      'Pecas o lentigos tras años de exposición',
      'Tono general apagado o desigual',
    ],
    actives: ['Vitamina C 10-15%', 'Niacinamida', 'Alfa arbutina', 'Ácido kójico', 'Ácido azelaico', 'Retinol', 'AHA glicólico o láctico', 'FPS 50 con reaplicación'],
    avoid: ['Sol sin protección', 'Exfoliar en exceso (efecto rebote)', 'Mezclar muchos ácidos a la vez', 'Remedios caseros como limón o bicarbonato'],
    routine: {
      morning: [
        { step: 'Limpiar', product: 'Limpiador suave', ingredients: 'Glicerina, sin fragancia', how: 'Sin frotar: la fricción puede empeorar el melasma.' },
        { step: 'Iluminar', product: 'Sérum antioxidante', ingredients: 'Vitamina C 10-15%', how: 'Por la mañana, antes de la crema y el solar.' },
        { step: 'Unificar', product: 'Sérum despigmentante', ingredients: 'Alfa arbutina, niacinamida', how: 'En las manchas y en todo el rostro para el tono.' },
        { step: 'Hidratar', product: 'Crema ligera', ingredients: 'Ceramidas, pantenol', how: 'Mantiene la barrera mientras tratas el tono.' },
        { step: 'Proteger', product: 'Protector solar FPS 50 con color', ingredients: 'Filtros + óxido de hierro', how: 'Dos dedos y reaplica cada 3 horas: es lo que más funciona.' },
      ],
      night: [
        { step: 'Doble limpieza', product: 'Aceite + gel suave', ingredients: 'Sin sulfatos', how: 'Asegura retirar bien el solar con color.' },
        { step: 'Renovar', product: 'Retinol', ingredients: 'Retinol 0,3-0,5%', how: '3 noches por semana, alternando con noches de descanso.' },
        { step: 'Tratar', product: 'Sérum despigmentante', ingredients: 'Azelaico 15% o kójico', how: 'En las zonas con más pigmento.' },
        { step: 'Hidratar', product: 'Crema reparadora', ingredients: 'Ceramidas, pantenol', how: 'Amortigua el retinol y evita la descamación.' },
      ],
      weekly: [
        { step: 'Peeling', product: 'Exfoliante químico AHA', ingredients: 'Ácido glicólico o láctico', how: 'Una noche por semana, sin sol al día siguiente.' },
        { step: 'Iluminar', product: 'Mascarilla unificadora', ingredients: 'Niacinamida, vitamina C', how: '15 minutos, una vez por semana.' },
      ],
    },
  },
]

const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v))

const STEP_KEYS = ['step', 'product', 'ingredients', 'how'] as const
const LEVELS = ['leve', 'moderado', 'marcado'] as const
const QUALITIES = ['buena', 'baja', 'aceptable'] as const

function toSteps(value: unknown): RoutineStep[] {
  if (!Array.isArray(value)) return []
  return value.map(item => {
    const o = (item ?? {}) as Record<string, unknown>
    return STEP_KEYS.reduce<Record<(typeof STEP_KEYS)[number], string>>(
      (acc, k) => ({ ...acc, [k]: str(o[k]) }),
      {} as Record<(typeof STEP_KEYS)[number], string>,
    )
  })
}

export function normalizeSkinType(value: unknown): SkinType {
  const raw = str(value).toLowerCase().replace(/^piel\s+/, '').trim()
  return (SKIN_TYPES as readonly string[]).includes(raw) ? (raw as SkinType) : 'normal'
}

export function normalizeCategories(value: unknown): CategoryKey[] {
  const list = Array.isArray(value) ? value : []
  const out: CategoryKey[] = []
  for (const raw of list) {
    const key = str(raw).toLowerCase().trim()
    if (SKIN_CATEGORIES.some(c => c.key === key) && !out.includes(key as CategoryKey)) out.push(key as CategoryKey)
  }
  return out.slice(0, 3)
}

export function categoryName(key: unknown): string {
  return SKIN_CATEGORIES.find(c => c.key === key)?.name ?? ''
}

export function normalizeSkinAnalysis(raw: unknown): SkinAnalysis {
  const o = (raw ?? {}) as Record<string, unknown>
  const need = (o['mainNeed'] ?? {}) as Record<string, unknown>
  const concerns = Array.isArray(o['concerns']) ? o['concerns'] : []
  return {
    isFace: o['isFace'] === true,
    skinType: normalizeSkinType(o['skinType']),
    categories: normalizeCategories(o['categories']),
    summary: str(o['summary']),
    photoQuality: (QUALITIES as readonly string[]).includes(str(o['photoQuality'])) ? (str(o['photoQuality']) as SkinAnalysis['photoQuality']) : 'aceptable',
    concerns: concerns.map(item => {
      const c = (item ?? {}) as Record<string, unknown>
      const level = str(c['level']).toLowerCase()
      return {
        name: str(c['name']),
        level: (LEVELS as readonly string[]).includes(level) ? (level as SkinAnalysis['concerns'][number]['level']) : 'leve',
        text: str(c['text']),
      }
    }),
    mainNeed: { title: str(need['title']), text: str(need['text']) },
    morning: toSteps(o['morning']),
    night: toSteps(o['night']),
    weekly: toSteps(o['weekly']),
    tips: Array.isArray(o['tips']) ? o['tips'].map(str).slice(0, 3) : [],
    medicalNote: str(o['medicalNote']).trim() ? str(o['medicalNote']) : null,
  }
}

/** Versión compacta de la guía que se le pasa a la IA como criterio fijo. */
export const SKIN_REFERENCE = SKIN_CATEGORIES.map(c =>
  `- ${c.name} (${c.key}) · se reconoce por: ${c.signs.join(' | ')}. Activos recomendados: ${c.actives.join(', ')}. Evitar: ${c.avoid.join(', ')}.`,
).join('\n')
