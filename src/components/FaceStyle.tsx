import { Button } from '@/components/ui/button'
import { FACE_SHAPES, MAKEUP_BY_SKIN, type FaceStyleAnalysis, type Swatch } from '@/lib/face-style'

function Palette({ colors }: { colors: Swatch[] }) {
  return (
    <div className="style-palette">
      {colors.map(c => (
        <div key={c.hex + c.name} className="style-swatch">
          <span style={{ backgroundColor: c.hex }} aria-hidden />
          <b>{c.name}</b><small>{c.use}</small>
        </div>
      ))}
    </div>
  )
}

export function FaceShapesSection({ onScan }: { onScan: () => void }) {
  return (
    <section className="how-section style-section">
      <p className="font-script section-script">Tu rostro, tu estilo</p>
      <h2 className="font-display">Formas de cara, maquillaje y colores</h2>
      <p className="style-intro">Cada forma de rostro luce mejor con ciertas técnicas y tonos. Escanea tu cara y la IA te dirá tu forma, tu subtono y la paleta que te favorece según tu tipo de piel.</p>
      <Button className="primary-button" onClick={onScan}>Analizar mi cara con IA</Button>
      <div className="style-grid">
        {FACE_SHAPES.map(s => (
          <article key={s.key} className="style-card">
            <h3 className="font-display">{s.name}</h3>
            <p>{s.signs}</p>
            <ul>{s.makeup.map(m => <li key={m}>{m}</li>)}</ul>
            <Palette colors={s.palette} />
          </article>
        ))}
      </div>
    </section>
  )
}

export function FaceStyleResult({ image, data, onReset }: { image: string; data: FaceStyleAnalysis; onReset: () => void }) {
  const shape = FACE_SHAPES.find(s => s.key === data.faceShape)
  return (
    <main className="page-shell fade-up style-section">
      <p className="font-script section-script">Maquillaje y color · IA</p>
      <h1 className="font-display">{data.isFace ? `Rostro ${shape?.name.toLowerCase() ?? 'sin determinar'}` : 'Repite la foto'}</h1>
      <img src={image} alt="Tu foto analizada" className="style-photo" />
      <p className="style-intro">{data.summary}</p>
      {data.isFace && <>
        <div className="style-grid">
          <article className="style-card"><h3 className="font-display">Tu forma</h3><p>{data.shapeNote || shape?.signs}</p></article>
          <article className="style-card"><h3 className="font-display">Piel {data.skinType}</h3><p>{MAKEUP_BY_SKIN[data.skinType]}</p></article>
          <article className="style-card"><h3 className="font-display">Subtono {data.undertone}</h3><p>Colores elegidos para favorecer tu subtono.</p></article>
        </div>
        <article className="style-card"><h3 className="font-display">Tu maquillaje</h3><ul>{data.makeup.map(m => <li key={m}>{m}</li>)}</ul></article>
        <article className="style-card"><h3 className="font-display">Tu paleta de colores</h3><Palette colors={data.palette} /></article>
      </>}
      <p className="style-intro"><small>Recomendación orientativa con IA; los colores en pantalla pueden variar.</small></p>
      <Button className="primary-button" onClick={onReset}>Analizar otra foto</Button>
    </main>
  )
}
