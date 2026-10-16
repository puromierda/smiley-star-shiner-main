import { describe, expect, it } from 'vitest'
import { normalizeLipAnalysis } from '../lib/lip-analysis'

describe('lip analysis', () => {
  it('removes makeup advice when no clear face is detected', () => {
    const result = normalizeLipAnalysis({ isFace: false, summary: 'Repite la foto', faceShape: 'ovalado', lipShape: 'finos', balance: 'Brillo central', steps: [{ title: 'Color', product: 'Labial', how: 'Aplicar' }], colors: [{ name: 'Rosa', reason: 'Contraste' }], avoid: ['Exceso'] })
    expect(result.steps).toEqual([])
    expect(result.colors).toEqual([])
    expect(result.faceShape).toBe('')
  })
  it('retains the personalized face and lip observations', () => {
    const result = normalizeLipAnalysis({ isFace: true, summary: 'Volumen visual', faceShape: 'redondo', lipShape: 'arco definido', balance: 'Respetar las comisuras', steps: [{ title: 'Delinear', product: 'Lápiz', how: 'Seguir el borde natural' }], colors: [{ name: 'Rosa', reason: 'Contraste suave' }], avoid: [] })
    expect(result.faceShape).toBe('redondo')
    expect(result.lipShape).toBe('arco definido')
  })
  it('replaces generated makeup with the natural care routine', () => {
    const result = normalizeLipAnalysis({ isFace: true, summary: 'Cuidado', faceShape: 'ovalado', lipShape: 'definidos', balance: 'Proporciones', steps: [{ title: 'Delinear', product: 'Lápiz', how: 'Delinear' }], colors: [{ name: 'Rosa', reason: 'Color' }], avoid: [] })
    expect(result.steps.map(step => step.product)).toEqual(['Bálsamo sin perfume ni color', 'Protector labial SPF 30 o superior', 'Vaselina pura sin perfume'])
    expect(result.colors).toEqual([])
  })
})