import React, { useEffect, useRef, useState, type ReactNode } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { analyzeSkin } from '@/lib/analyze.functions'
import { analyzeLips } from '@/lib/lips.functions'
import type { LipAnalysis } from '@/lib/lip-analysis'
import { LipResult } from '@/components/LipResult'
import { LipsPage } from '@/components/LipsPage'
import { AdminPanel } from '@/components/AdminPanel'
import { Button } from '@/components/ui/button'
import type { SkinAnalysis, RoutineStep } from '@/lib/analysis-types'
import { categoryName, SKIN_CATEGORIES, type CategoryKey } from '@/lib/skin-guide'
import faceScan from '@/assets/face-scan.jpg'
// Firebase auth se integrará aquí
import { lovable } from '@/integrations/lovable/index'
import { daysSince, loadJourney, loadScan, saveJourney, saveScan, type Journey, type SavedScan } from '@/lib/skin-journal'

function shrinkImage(src: string, max = 1024): Promise<string> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height)
      resolve(c.toDataURL('image/jpeg', .85))
    }
    img.onerror = () => resolve(src)
    img.src = src
  })
}

type View = 'Inicio' | 'Mi piel' | 'Labios' | 'Rutinas' | 'Premium' | 'Admin'

// Modo simulado: acceso completo sin validación de backend
const isDev = true

const icons: Record<string, ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7"/></>,
  crown: <><path d="m3 7 4.5 4L12 4l4.5 7L21 7l-2 11H5L3 7Z"/><path d="M5 21h14"/></>,
  camera: <><path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="M12 3 4 6v5c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V6l-8-3Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></>,
  sparkle: <><path d="M12 2c.8 5.6 2.4 7.2 8 8-5.6.8-7.2 2.4-8 8-.8-5.6-2.4-7.2-8-8 5.6-.8 7.2-2.4 8-8Z"/><path d="M19 17c.3 2.1.9 2.7 3 3-2.1.3-2.7.9-3 3-.3-2.1-.9-2.7-3-3 2.1-.3 2.7-.9 3-3Z"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.5 3.4-7 8-7s7.2 2.5 8 7"/></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
  drop: <path d="M12 3S6 10 6 15a6 6 0 0 0 12 0c0-5-6-12-6-12Z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>,
  lips: <><path d="M2 12c4-1 6-5 10-2 4-3 6 1 10 2-5 8-15 8-20 0Z"/><path d="M2 12c6 2 14 2 20 0"/></>,
}

function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

function Brand() {
  return (
    <div className="leading-none text-center">
      <div className="font-script text-3xl text-rose">Selem Beauty</div>
      <div className="mt-1 text-[8px] uppercase tracking-[0.26em] text-gold">Cuidado y Belleza</div>
    </div>
  )
}

function Watermark() {
  return <div className="watermark hidden sm:block"><Brand /></div>
}

function FaceDemo() {
  return (
    <div className="face-demo" aria-hidden="true">
      <img className="face-demo-img" src={faceScan} alt="" width={1024} height={688} />
    </div>
  )
}

function Home({ onSkin, onLips }: { onSkin: () => void; onLips: () => void }) {
  return (
    <main className="page-shell fade-up">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><Icon name="sparkle" size={14} /> Cuidado y Belleza</div>
          <p className="font-script hero-script">Escanea tu piel</p>
          <h1 className="font-display">Descubre lo que<br />tu piel <em>necesita.</em></h1>
          <p className="hero-description">
            Toma una foto de tu rostro y recibe en segundos un análisis de tu tipo de piel,
            lo que la piel está pidiendo y una rutina de mañana, noche y semana pensada para ti.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onSkin}><Icon name="camera" /> Escanear mi piel <Icon name="arrow" size={17} /></button>
            <Button variant="ghost" className="secondary-button" onClick={onLips}><Icon name="lips" /> Labios con más volumen</Button>
          </div>
          <div className="trust-row">
            <span><Icon name="sparkle" size={17} /> Análisis con IA</span>
            <span><Icon name="shield" size={17} /> Recomendaciones seguras</span>
            <span><Icon name="heart" size={17} /> Pensado para tu piel</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-orb" />
          <div className="phone-card">
            <div className="phone-status"><span>9:41</span><span className="signal">● ●●</span></div>
            <div className="mini-brand font-script">Selem Beauty</div>
            <div className="scan-preview">
              <div className="scan-corners" />
              <FaceDemo />
              <div className="scan-line" />
            </div>
            <div className="detected-pill"><span /> Rostro detectado</div>
            <div className="phone-product"><div><b>Tu diagnóstico en segundos</b><small>Piel · necesidades · rutina</small></div><div className="step-icon"><Icon name="sparkle" size={18} /></div></div>
          </div>
          <div className="floating-note floating-note--top"><Icon name="check" size={16} /><span><b>Tipo de piel</b>Identificado con IA</span></div>
          <div className="floating-note floating-note--bottom"><Icon name="shield" size={16} /><span><b>Rutina a tu medida</b>Mañana, noche y semana</span></div>
        </div>
      </section>

      <section className="how-section">
        <p className="font-script section-script">Una foto, tu piel al descubierto</p>
        <h2 className="font-display">Así de fácil conocer tu piel</h2>
        <div className="steps-grid">
          {[
            ['01', 'camera', 'Tómate la foto', 'Rostro limpio, de frente y con luz natural, sin filtros ni maquillaje.'],
            ['02', 'sparkle', 'Analiza', 'La IA examina tu piel e identifica su tipo y lo que más necesita.'],
            ['03', 'heart', 'Cuida', 'Recibe tu rutina de mañana, noche y semana con los activos que debes buscar.'],
          ].map(([number, icon, title, text]) => (
            <div className="step-card" key={number}>
              <div className="step-icon"><Icon name={icon ?? ""} /></div>
              <h3 className="font-display">{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Scanner({ onAnalyze, lips = false }: { onAnalyze: (image: string) => void; lips?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [message, setMessage] = useState('Abre la cámara para tomar tu foto')

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraOpen(true)
      setMessage('Centra tu rostro, sin maquillaje y con luz natural')
    } catch {
      setMessage('No pudimos abrir la cámara. Revisa los permisos de la cámara e inténtalo de nuevo.')
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    streamRef.current?.getTracks().forEach(track => track.stop())
    onAnalyze(canvas.toDataURL('image/jpeg', .88))
  }


  useEffect(() => () => streamRef.current?.getTracks().forEach(track => track.stop()), [])

  return (
    <main className="scanner-page fade-up">
      <div className="scanner-copy">
        <p className="font-script section-script">{lips ? 'Labios con más volumen · IA' : 'Escaneo facial con IA'}</p>
        <h1 className="font-display">{lips ? 'Escanea tu rostro' : 'Analicemos tu piel'}</h1>
        <p>{lips ? 'Cuidados naturales, sin maquillaje, para labios hidratados y de aspecto más terso. No aumentan el volumen real. Foto de frente, labios relajados, sin filtros ni labial.' : 'Toma una foto de frente, con el rostro limpio, sin filtros y con buena luz natural.'}</p>
      </div>
      <div className={`camera-view ${cameraOpen ? 'camera-live' : ''}`}>
        <video ref={videoRef} className="camera-feed" playsInline muted />
        {!cameraOpen && <div className="camera-placeholder"><img className="camera-face" src={faceScan} alt="Ilustración genérica de un rostro de frente dentro del marco de escaneo" width={1024} height={688} loading="lazy" /><span className="camera-guide">Rostro de frente, dentro del marco</span></div>}
        <div className="product-focus"><i /><i /><i /><i /></div>
        <div className="camera-hint">{message}</div>
      </div>
      <canvas ref={canvasRef} hidden />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              onAnalyze(reader.result)
            }
          }
          reader.readAsDataURL(file)
        }}
      />
      <div className="photo-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        {!cameraOpen ? (
          <>
            <Button className="scan-trigger" onClick={openCamera}><span><Icon name="camera" size={24} /></span>Abrir cámara</Button>
            <Button variant="ghost" className="secondary-button" onClick={() => fileInputRef.current?.click()} style={{ borderRadius: 99, border: '1px solid rgba(201,168,122,.5)' }}>
              <span><Icon name="upload" size={18} /></span> Subir foto de tu galería
            </Button>
          </>
        ) : (
          <Button className="scan-trigger" onClick={capturePhoto}><span><Icon name="sparkle" size={24} /></span>Capturar y analizar</Button>
        )}
      </div>
      <p className="privacy-note"><Icon name="shield" size={13} /> La imagen se utiliza únicamente para generar tu análisis.</p>
    </main>
  )
}

function RoutineList({ title, steps }: { title: string; steps: RoutineStep[] }) {
  if (!steps?.length) return null
  return (
    <section className="routine-section">
      <h2 className="font-display routine-title">{title}</h2>
      <div className="routine-steps">{steps.map((s, i) => <article className="routine-step" key={`${s.step}-${i}`}><h3 className="font-display">{s.step}</h3><p className="routine-product">{s.product}</p><p><b>Activos:</b> {s.ingredients}</p><p>{s.how}</p></article>)}</div>
    </section>
  )
}

const LEVEL: Record<string, number> = { leve: 1, moderado: 2, marcado: 3 }
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

function Comparison({ before, after, onClose }: { before: SavedScan; after: SavedScan; onClose: () => void }) {
  const names = Array.from(new Set([...before.analysis.concerns, ...after.analysis.concerns].map(c => c.name)))
  return (
    <main className="result-page fade-up">
      <button className="back-button" onClick={onClose}>← Volver</button>
      <div className="center-heading">
        <p className="font-script section-script">Tu progreso</p>
        <h1 className="font-display">Antes y después</h1>
        <p>{daysSince(before.date) - daysSince(after.date) + 1} días de rutina</p>
      </div>
      <section className="compare-grid">
        {[['ANTES', before], ['DESPUÉS', after]].map(([label, s]) => {
          const scan = s as SavedScan
          return (
            <article className="compare-card" key={label as string}>
              <span className="brand-label">{label as string} · {fmtDate(scan.date)}</span>
              <img src={scan.photo} alt={`Foto ${label}`} />
              <h3 className="font-display">Piel {scan.analysis.skinType}</h3>
              <p>{scan.analysis.mainNeed.title}</p>
            </article>
          )
        })}
      </section>
      <section className="recommendation-card compare-table">
        <span>CAMBIOS EN TU PIEL</span>
        {names.map(n => {
          const b = before.analysis.concerns.find(c => c.name === n)
          const a = after.analysis.concerns.find(c => c.name === n)
          const diff = (LEVEL[b?.level ?? ''] ?? 0) - (LEVEL[a?.level ?? ''] ?? 0)
          return (
            <div className="compare-row" key={n}>
              <b>{n}</b><span>{b?.level ?? '—'}</span><span>→</span><span>{a?.level ?? 'no visible'}</span>
              <em className={diff > 0 ? 'better' : diff < 0 ? 'worse' : ''}>{diff > 0 ? 'Mejoró' : diff < 0 ? 'Aumentó' : 'Igual'}</em>
            </div>
          )
        })}
      </section>
      <div className="ai-disclaimer"><Icon name="sparkle" size={17} /><span><b>Comparación orientativa</b>La luz y el ángulo de la foto influyen. Tómalas en condiciones parecidas.</span></div>
    </main>
  )
}

function JourneyBanner({ journey, onFinish, onCancel }: { journey: Journey; onFinish: () => void; onCancel: () => void }) {
  return (
    <div className="journey-banner">
      <div><span className="brand-label">RUTINA EN CURSO</span><h3 className="font-display">Día {daysSince(journey.startedAt)}</h3><p>Cuando termines tu rutina, toma la foto de “después” con la misma luz y ángulo.</p></div>
      <div className="journey-actions">
        <button className="primary-button" onClick={onFinish}><Icon name="camera" /> Finalizar rutina y tomar foto</button>
        <button className="secondary-button" onClick={onCancel}>Cancelar rutina</button>
      </div>
    </div>
  )
}

function SkinResult({ image, data, onReset, onOpenCategory, onStart, journeyActive }: { image: string; data: SkinAnalysis; onReset: () => void; onOpenCategory: (key: CategoryKey) => void; onStart: () => void; journeyActive: boolean }) {
  return (
    <main className="result-page fade-up">
      <button className="back-button" onClick={onReset}>← Escanear de nuevo</button>
      <div className="journey-banner">
        <div><span className="brand-label">GUARDADO</span><p>Tu foto, análisis y rutina quedaron guardados en este dispositivo.</p></div>
        {data.isFace && !journeyActive && <button className="primary-button" onClick={onStart}><Icon name="heart" /> Empezar rutina</button>}
        {journeyActive && <b>Rutina en curso</b>}
      </div>
      <section className="product-header ai-product-header">
        <div className="result-product-art"><div className="result-orb" /><img className="scanned-photo" src={image} alt="Tu rostro" /></div>
        <div className="result-copy">
          <span className="brand-label">DIAGNÓSTICO DE PIEL</span>
          <h1 className="font-display">{data.isFace ? `Piel ${data.skinType}` : 'Repite la foto'}</h1>
          <p>{data.summary}</p>
          {data.isFace && <div className="product-badges"><span><Icon name="check" size={14} /> Calidad de foto: {data.photoQuality}</span></div>}
        </div>
      </section>
      <div className="ai-disclaimer"><Icon name="sparkle" size={17} /><span><b>Análisis orientativo con IA</b>No sustituye la consulta con un dermatólogo. Si tienes una condición de la piel, consulta a un profesional.</span></div>
      {data.isFace && <>
        <section className="analysis-section">
          <div className="section-heading"><div><p className="font-script section-script">Lo que vemos en tu piel</p></div></div>
          <div className="benefit-grid">{data.concerns.map(c => <article className="benefit-card" key={c.name}><div className="step-icon"><Icon name="drop" /></div><h3 className="font-display">{c.name}</h3><p><b>{c.level}</b> · {c.text}</p></article>)}</div>
        </section>
        <section className="decision-card"><div><span>TU NECESIDAD PRINCIPAL</span><h2 className="font-display">{data.mainNeed.title}</h2><p>{data.mainNeed.text}</p></div></section>
        {data.categories.length > 0 && (
          <div className="category-pills">
            <span>TU CATEGORÍA</span>
            {data.categories.map(key => <button key={key} onClick={() => onOpenCategory(key)}>{categoryName(key)} <Icon name="arrow" size={13} /></button>)}
          </div>
        )}
        <section className="recommendation-grid recommendation-grid--single">
          <RoutineList title="RUTINA DE MAÑANA" steps={data.morning} />
          <RoutineList title="RUTINA DE NOCHE" steps={data.night} />
          <RoutineList title="CUIDADO SEMANAL" steps={data.weekly} />
        </section>
        {data.tips?.length > 0 && <section className="product-details-section"><div className="section-heading"><div><p className="font-script section-script">Consejos para ti</p></div></div><div className="product-details-grid">{data.tips.map((t, i) => <article key={i}><div><p>{t}</p></div></article>)}</div></section>}
        {data.medicalNote && <div className="ai-disclaimer" role="note"><Icon name="shield" size={17} /><span><b>Recomendación médica</b>{data.medicalNote}</span></div>}
      </>}
    </main>
  )
}

function Routines({ open, onOpen, onScan }: { open: CategoryKey; onOpen: (key: CategoryKey) => void; onScan: () => void }) {
  const active = SKIN_CATEGORIES.find(c => c.key === open) ?? SKIN_CATEGORIES[0]
  if (!active) return null
  return (
    <main className="routines-page page-shell fade-up">
      <div className="center-heading">
        <p className="font-script section-script">Rutinas por tipo de piel</p>
        <h1 className="font-display">Elige tu categoría.</h1>
        <p>Seis categorías con su rutina base de mañana, noche y semana. ¿No sabes cuál es la tuya? Escanea tu rostro y te decimos cuál te toca.</p>
        <button className="secondary-button" style={{ marginTop: 20 }} onClick={onScan}><Icon name="camera" /> Escanear mi piel</button>
      </div>
      <div className="category-grid">
        {SKIN_CATEGORIES.map((c) => (
          <button key={c.key} className={`category-card ${open === c.key ? 'is-open' : ''}`} onClick={() => onOpen(c.key)}>
            <h3 className="font-display">{c.name}</h3>
            <p>{c.tagline}</p>
            <span className="category-link">{open === c.key ? 'Cerrar' : 'Ver rutina'} <Icon name="arrow" size={14} /></span>
          </button>
        ))}
      </div>
      <section className="category-detail">
        <div className="category-detail-head">
          <div>
            <span className="brand-label">CATEGORÍA</span>
            <h2 className="font-display">{active.name}</h2>
            <p>{active.tagline}</p>
          </div>
          <button className="secondary-button" onClick={onScan}><Icon name="sparkle" /> Confirmar con un escaneo</button>
        </div>
        <div className="category-notes">
          <article><span>SE RECONOCE POR</span><ul>{active.signs.map(s => <li key={s}>{s}</li>)}</ul></article>
          <article><span>ACTIVOS CLAVE</span><ul>{active.actives.map(s => <li key={s}>{s}</li>)}</ul></article>
          <article className="avoid"><span>MEJOR EVITAR</span><ul>{active.avoid.map(s => <li key={s}>{s}</li>)}</ul></article>
        </div>
        <div className="recommendation-grid">
          <RoutineList title="RUTINA DE MAÑANA" steps={active.routine.morning} />
          <RoutineList title="RUTINA DE NOCHE" steps={active.routine.night} />
        </div>
        {active.routine.weekly.length > 0 && (
          <div className="recommendation-grid recommendation-grid--single" style={{ marginTop: 18 }}>
            <RoutineList title="CUIDADO SEMANAL" steps={active.routine.weekly} />
          </div>
        )}
      </section>
    </main>
  )
}

function Premium() {
  return (
    <main className="premium-page page-shell fade-up">
      <div className="center-heading">
        <p className="font-script section-script">Selem Beauty Premium</p>
        <h1 className="font-display">Analiza tu piel sin límites.</h1>
        <p>Escanéate tantas veces como quieras y sigue de cerca cómo avanza tu piel con rutinas hechas para ti.</p>
        {isDev && <div className="dev-badge">Modo desarrolladora activo · Acceso completo</div>}
      </div>
      <div className="pricing-grid single-plan">
        <article className="price-card featured">
          <span className="popular-label">ACCESO COMPLETO</span>
          <h2 className="font-display">Análisis ilimitado</h2>
          <div className="price"><b>$13.99</b><span>/mes</span></div>
          <ul>
            {['Escaneos faciales sin límite', 'Rutina según tu tipo de piel', 'Seguimiento de tu progreso', 'Experiencia sin publicidad'].map(feature => <li key={feature}><Icon name="check" size={15} /> {feature}</li>)}
          </ul>
          <a className="primary-button" href="https://paypal.me/Selemab/13.99" target="_blank" rel="noreferrer">Activar análisis ilimitado</a>
        </article>
      </div>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<View>('Inicio')
  const [photo, setPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [routineKey, setRoutineKey] = useState<CategoryKey>('mixta')
  const [lipScanning, setLipScanning] = useState(false)

  function navigate(next: View) {
    setView(next)
    setPhoto(null); setError(null)
    setLipScanning(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openCategory(key: CategoryKey) {
    setRoutineKey(key)
    navigate('Rutinas')
  }

  const runSkin = useServerFn(analyzeSkin)
  const runLips = useServerFn(analyzeLips)
  const [lipResult, setLipResult] = useState<{ image: string; data: LipAnalysis } | null>(null)
  const [lipLoading, setLipLoading] = useState(false)
  const [lipError, setLipError] = useState<string | null>(null)
  const lipRequest = useRef(0)
  const [skin, setSkin] = useState<SkinAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [journey, setJourney] = useState<Journey | null>(null)
  const [lastScan, setLastScan] = useState<SavedScan | null>(null)
  const [afterMode, setAfterMode] = useState(false)
  const [compare, setCompare] = useState<{ before: SavedScan; after: SavedScan } | null>(null)

  // TODO: reemplazar con Firebase Auth
  const userId: string | null = null
  function signIn() {
    // Placeholder para la futura integración con Firebase Auth
    console.info('Iniciar sesión: pendiente de integración con Firebase Auth')
  }
  useEffect(() => {
    loadJourney().then(async j => {
      setJourney(j)
      if (j?.afterId) {
        const [b, a] = await Promise.all([loadScan(j.beforeId), loadScan(j.afterId)])
        if (b && a) setCompare({ before: b, after: a })
      }
    })
  }, [])

  async function analyzeLipPhoto(image: string) {
    const request = ++lipRequest.current
    setLipLoading(true); setLipError(null)
    try {
      const small = await shrinkImage(image, 720)
      const result = await runLips({ data: { image: small } })
      if (request !== lipRequest.current) return
      if (result.ok) setLipResult({ image: small, data: result.analysis })
      else setLipError(result.error)
    } catch (error) {
      if (request === lipRequest.current) setLipError(error instanceof Error ? error.message : 'No se pudo analizar la foto.')
    } finally {
      if (request === lipRequest.current) setLipLoading(false)
    }
  }

  async function analyzeFace(image: string) {
    setLoading(true); setError(null)
    const small = await shrinkImage(image, 720)
    try {
      const res = await runSkin({ data: { image: small } })
      if (res.ok) {
        let scan: SavedScan | null = null
        try {
          scan = await saveScan(small, res.analysis)
        } catch {
          scan = { id: String(Date.now()), date: new Date().toISOString(), photo: small, analysis: res.analysis }
        }
        const before = journey && await loadScan(journey.beforeId)
        if (afterMode && journey && before && res.analysis.isFace) {
          const done = { ...journey, afterId: scan.id }
          saveJourney(done); setJourney(done); setAfterMode(false)
          setCompare({ before, after: scan })
        } else { setLastScan(scan); setSkin(res.analysis); setPhoto(small) }
      } else {
        setError(res.error || 'No se pudo analizar la foto.')
      }
    } catch (err) {
      console.error('Error al analizar rostro:', err)
      setError(err instanceof Error ? err.message : 'No pudimos analizar tu piel. Intenta de nuevo.')
    }
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startJourney() {
    if (!lastScan) return
    const j = { beforeId: lastScan.id, startedAt: new Date().toISOString(), afterId: null }
    saveJourney(j); setJourney(j)
  }
  function closeCompare() { saveJourney(null); setJourney(null); setCompare(null) }
  const activeJourney = journey && !journey.afterId ? journey : null

  const nav = [['Inicio', 'home'], ['Mi piel', 'user'], ['Labios', 'lips'], ['Rutinas', 'sparkle'], ['Premium', 'crown']] as const

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand-button" onClick={() => navigate('Inicio')}><Brand /></button>
        <nav className="desktop-nav">
          {nav.map(([label]) => <Button variant="ghost" key={label} className={view === label ? 'active' : ''} onClick={() => navigate(label)}>{label}</Button>)}
          <Button
            variant="ghost"
            className={view === 'Admin' ? 'active' : ''}
            onClick={() => navigate('Admin')}
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '99px',
              border: '1px solid rgba(201,168,122,.35)',
              color: view === 'Admin' ? '#fff' : 'var(--color-rose-deep)',
              background: view === 'Admin' ? 'var(--color-rose)' : 'rgba(255,255,255,0.7)',
            }}
          >
            <Icon name="shield" size={13} /> Admin
          </Button>
        </nav>
        {/* Botón de perfil: Firebase Auth pendiente de integración */}
      </header>

      {view === 'Admin' && <AdminPanel onBack={() => navigate('Inicio')} />}
      {view === 'Inicio' && <Home onSkin={() => navigate('Mi piel')} onLips={() => navigate('Labios')} />}
      {view === 'Labios' && (
        lipLoading ? (
          <main className="loading-page fade-up">
            <div className="loading-orb"><Icon name="lips" size={28} /></div>
            <p className="font-script">Analizando tu rostro…</p>
            <span>Preparando tu rutina natural de labios</span>
          </main>
        ) : lipResult ? (
          <LipResult
            image={lipResult.image}
            data={lipResult.data}
            onReset={() => { setLipResult(null); setLipError(null); setLipScanning(false) }}
          />
        ) : lipScanning ? (
          <main className="fade-up" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '90px' }}>
            <div style={{ maxWidth: 640, margin: '0 auto 16px', padding: '0 20px', display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="ghost" onClick={() => setLipScanning(false)} className="back-button">
                ← Volver a Labios más voluminosos
              </Button>
            </div>
            {lipError && (
              <div className="ai-disclaimer" role="alert" style={{ maxWidth: 640, margin: '0 auto 20px' }}>
                <span><b>No se pudo analizar</b>{lipError}</span>
              </div>
            )}
            <Scanner key="lips" lips onAnalyze={analyzeLipPhoto} />
          </main>
        ) : (
          <LipsPage
            onStartScan={() => setLipScanning(true)}
            onSignIn={signIn}
            userId={userId}
          />
        )
      )}
      {view === 'Rutinas' && <Routines open={routineKey} onOpen={setRoutineKey} onScan={() => navigate('Mi piel')} />}
      {view === 'Mi piel' && (loading
        ? <main className="loading-page fade-up"><div className="loading-orb"><Icon name="sparkle" size={28} /></div><p className="font-script">Analizando tu piel…</p><span>Identificando necesidades y preparando tu rutina</span></main>
        : compare
          ? <Comparison before={compare.before} after={compare.after} onClose={closeCompare} />
          : photo && skin
            ? <SkinResult image={photo} data={skin} onReset={() => setPhoto(null)} onOpenCategory={openCategory} onStart={startJourney} journeyActive={!!activeJourney} />
            : <>
                {activeJourney && !afterMode && <div style={{ maxWidth: 760, margin: '100px auto -70px', padding: '0 16px' }}><JourneyBanner journey={activeJourney} onFinish={() => setAfterMode(true)} onCancel={() => { saveJourney(null); setJourney(null) }} /></div>}
                {afterMode && <div className="ai-disclaimer" style={{ maxWidth: 640, margin: '100px auto -80px' }}><Icon name="camera" size={17} /><span><b>Foto de después</b>Usa la misma luz y ángulo que en tu primera foto.</span></div>}
                {error && <div className="ai-disclaimer" role="alert" style={{ maxWidth: 640, margin: '100px auto -80px' }}><Icon name="shield" size={17} /><span><b>No se pudo analizar</b>{error}</span></div>}
                <Scanner key="face" onAnalyze={analyzeFace} />
              </>)}
      {view === 'Premium' && <Premium />}

      <nav className="mobile-nav grid-cols-5">{nav.map(([label, icon]) => <Button variant="ghost" key={label} className={view === label ? 'active' : ''} onClick={() => navigate(label)}><Icon name={icon} size={19} /><span>{label}</span></Button>)}</nav>
      <Watermark />
    </div>
  )
}
