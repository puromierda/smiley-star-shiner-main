import { Button } from '@/components/ui/button'
import type { LipAnalysis } from '@/lib/lip-analysis'

export function LipResult({ image, data, onReset }: { image: string; data: LipAnalysis; onReset: () => void }) {
  return <main className="result-page lip-care-page fade-up">
    <Button variant="ghost" className="back-button" onClick={onReset}>← Escanear de nuevo</Button>
    <section className="product-header ai-product-header">
      <div className="result-product-art"><img className="scanned-photo" src={image} alt="Tu rostro para el análisis de labios" /></div>
      <div className="result-copy"><span className="brand-label">LABIOS · CUIDADO NATURAL CON IA</span><h1 className="font-display">{data.isFace ? 'Labios naturalmente cuidados' : 'Repite la foto'}</h1><p>{data.summary}</p></div>
    </section>
    <div className="ai-disclaimer"><span><b>Cuidado, no aumento de volumen</b>La hidratación puede dar un aspecto más terso, pero ninguna rutina natural ha demostrado aumentar permanentemente el volumen de los labios. Natural no siempre significa seguro. Orientación con IA, no diagnóstico.</span></div>
    {data.isFace && <>
      <section className="benefit-grid">
        <article className="benefit-card"><span className="brand-label">TU ROSTRO</span><h2 className="font-display">{data.faceShape}</h2></article>
        <article className="benefit-card"><span className="brand-label">TUS LABIOS</span><h2 className="font-display">{data.lipShape}</h2></article>
      </section>
      <section className="decision-card"><div><span>ARMONÍA Y PROPORCIONES</span><p>{data.balance}</p></div></section>
      <section className="routine-section"><h2 className="font-display routine-title">Tu rutina natural de labios</h2><div className="routine-steps">{data.steps.map((step, i) => <article className="routine-step" key={i}><h3 className="font-display">{step.title}</h3><p className="routine-product">{step.product}</p><p>{step.how}</p></article>)}</div></section>
      {data.avoid.length > 0 && <section className="product-details-section"><h2 className="font-display">Mejor evitar</h2><ul>{data.avoid.map((item, i) => <li key={i}>{item}</li>)}</ul></section>}
    </>}
  </main>
}