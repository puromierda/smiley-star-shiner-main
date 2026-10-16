import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SKIN_CATEGORIES } from '@/lib/skin-guide'

interface AdminPanelProps {
  onBack: () => void
}

interface ScanRecord {
  id: string
  date: string
  user: string
  type: string
  skinType: string
  score: number
  mainNeed: string
  status: 'Completado' | 'En revisión' | 'Alerta dermatológica'
}

const MOCK_SCANS: ScanRecord[] = [
  { id: 'SC-9821', date: 'Hace 5 min', user: 'valentina.m@gmail.com', type: 'Facial', skinType: 'Mixta', score: 94, mainNeed: 'Equilibrio de zona T', status: 'Completado' },
  { id: 'SC-9820', date: 'Hace 18 min', user: 'camila.r@outlook.com', type: 'Labios', skinType: 'Labios secos', score: 91, mainNeed: 'Hidratación y volumen natural', status: 'Completado' },
  { id: 'SC-9819', date: 'Hace 42 min', user: 'sofia.castro@gmail.com', type: 'Facial', skinType: 'Sensible', score: 88, mainNeed: 'Calmar rojez y barrera cutánea', status: 'Alerta dermatológica' },
  { id: 'SC-9818', date: 'Hace 1 hora', user: 'lucia.b@gmail.com', type: 'Labios', skinType: 'Labios finos', score: 95, mainNeed: 'Gimnasia labial y ácido hialurónico', status: 'Completado' },
  { id: 'SC-9817', date: 'Hace 2 horas', user: 'mariana.p@yahoo.com', type: 'Facial', skinType: 'Grasa', score: 89, mainNeed: 'Control de sebo y poros', status: 'Completado' },
  { id: 'SC-9816', date: 'Hace 3 horas', user: 'elena.g@gmail.com', type: 'Facial', skinType: 'Seca', score: 93, mainNeed: 'Nutrición con ceramidas', status: 'Completado' },
]

const MOCK_USERS = [
  { id: 'USR-101', name: 'Valentina Morales', email: 'valentina.m@gmail.com', plan: 'Premium', scans: 14, joined: '12 Sep 2026', active: true },
  { id: 'USR-102', name: 'Camila Ríos', email: 'camila.r@outlook.com', plan: 'Premium', scans: 8, joined: '28 Sep 2026', active: true },
  { id: 'USR-103', name: 'Sofía Castro', email: 'sofia.castro@gmail.com', plan: 'Gratis', scans: 2, joined: '04 Oct 2026', active: false },
  { id: 'USR-104', name: 'Lucía Benítez', email: 'lucia.b@gmail.com', plan: 'Premium', scans: 19, joined: '15 Ago 2026', active: true },
  { id: 'USR-105', name: 'Mariana Peralta', email: 'mariana.p@yahoo.com', plan: 'Gratis', scans: 1, joined: '11 Oct 2026', active: true },
]

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [tab, setTab] = useState<'dashboard' | 'scans' | 'lips' | 'routines' | 'users' | 'settings'>('dashboard')
  const [filterType, setFilterType] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [scans, setScans] = useState<ScanRecord[]>(MOCK_SCANS)
  const [users, setUsers] = useState(MOCK_USERS)
  const [devMode, setDevMode] = useState(true)
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null)
  const [bannerNotice, setBannerNotice] = useState<string | null>(null)

  function toggleUserPlan(userId: string) {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextPlan = u.plan === 'Premium' ? 'Gratis' : 'Premium'
        return { ...u, plan: nextPlan }
      }
      return u
    }))
    setBannerNotice('Plan de usuario actualizado correctamente.')
    setTimeout(() => setBannerNotice(null), 3000)
  }

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.user.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.skinType.toLowerCase().includes(searchTerm.toLowerCase())
    if (filterType === 'todos') return matchesSearch
    return matchesSearch && s.type.toLowerCase() === filterType.toLowerCase()
  })

  return (
    <main className="page-shell fade-up" style={{ paddingTop: '100px', paddingBottom: '90px', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Barra superior de administración */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid rgba(201,168,122,.25)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: 'var(--color-rose)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: '0.1em' }}>
              ADMIN
            </span>
            <span className="font-script" style={{ fontSize: 28, color: 'var(--color-rose)' }}>Selem Beauty</span>
          </div>
          <h1 className="font-display" style={{ fontSize: 26, margin: '4px 0 0', color: 'var(--color-charcoal)' }}>
            Panel de Control y Gestión
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--color-muted-text)', background: 'rgba(255,255,255,0.7)', padding: '6px 12px', borderRadius: 99, border: '1px solid rgba(201,168,122,.3)' }}>
            ● Servidor: <b>En línea (8080)</b>
          </div>
          <Button variant="ghost" onClick={onBack} className="secondary-button" style={{ minHeight: 40, padding: '0 18px', fontSize: 13 }}>
            ← Volver a la App
          </Button>
        </div>
      </div>

      {bannerNotice && (
        <div style={{ background: '#eaf5ed', color: '#3d7250', padding: '10px 18px', borderRadius: 12, marginBottom: 20, fontSize: 13, border: '1px solid rgba(95, 152, 114, 0.3)' }}>
          ✓ {bannerNotice}
        </div>
      )}

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 26, borderBottom: '1px solid rgba(201,168,122,.15)' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'scans', label: '🔍 Escaneos con IA' },
          { id: 'lips', label: '💄 Programa Labios' },
          { id: 'routines', label: '🧴 Categorías y Rutinas' },
          { id: 'users', label: '👥 Usuarios y Planes' },
          { id: 'settings', label: '⚙️ Configuración' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              border: 0,
              background: tab === t.id ? 'var(--color-rose)' : 'rgba(255,255,255,0.65)',
              color: tab === t.id ? '#fff' : 'var(--color-charcoal)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all .2s',
              boxShadow: tab === t.id ? '0 4px 14px rgba(201,116,143,.3)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* VISTA 1: DASHBOARD */}
      {tab === 'dashboard' && (
        <div className="fade-up">
          {/* Métricas clave */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Escaneos Faciales Totales', val: '3,428', badge: '+14% hoy', color: 'var(--color-rose)' },
              { label: 'Análisis de Labios', val: '1,842', badge: 'Alta demanda', color: 'var(--color-gold)' },
              { label: 'Usuarios Registrados', val: '892', badge: '78% activos', color: '#5f9872' },
              { label: 'Suscripciones Premium', val: '164', badge: '$2,294/mes', color: 'var(--color-rose-deep)' },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.85)', padding: '22px', borderRadius: 18, border: '1px solid rgba(201,168,122,.25)', boxShadow: '0 8px 24px rgba(160,86,107,.05)' }}>
                <span style={{ fontSize: 11, color: 'var(--color-muted-text)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.label}</span>
                <div style={{ fontSize: 32, fontWeight: 700, margin: '8px 0', color: 'var(--color-charcoal)', fontFamily: 'var(--font-display)' }}>{m.val}</div>
                <span style={{ fontSize: 11, color: m.color, fontWeight: 600, background: 'rgba(255,255,255,0.9)', padding: '3px 8px', borderRadius: 99, border: '1px solid rgba(201,168,122,.2)' }}>
                  {m.badge}
                </span>
              </div>
            ))}
          </div>

          {/* Gráfico y Distribución */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '24px', borderRadius: 20, border: '1px solid rgba(201,168,122,.25)' }}>
              <h2 className="font-display" style={{ fontSize: 18, margin: '0 0 16px' }}>Distribución por Tipo de Piel</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { type: 'Piel Mixta', pct: 42, color: 'var(--color-rose)' },
                  { type: 'Piel Grasa', pct: 28, color: 'var(--color-gold)' },
                  { type: 'Piel Seca', pct: 18, color: '#6eaa84' },
                  { type: 'Piel Sensible', pct: 12, color: '#c07a6a' },
                ].map(item => (
                  <div key={item.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                      <span><b>{item.type}</b></span>
                      <span>{item.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#f0e6e2', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '24px', borderRadius: 20, border: '1px solid rgba(201,168,122,.25)' }}>
              <h2 className="font-display" style={{ fontSize: 18, margin: '0 0 16px' }}>Módulo Labios: Interacciones</h2>
              <p style={{ fontSize: 13, color: 'var(--color-muted-text)', lineHeight: 1.6 }}>
                El nuevo programa <b>«Labios más voluminosos naturales»</b> ha registrado 340 accesos al plan completo en las últimas 24 horas.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <div style={{ padding: 14, borderRadius: 12, background: '#fffaf7', border: '1px solid rgba(201,168,122,.2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-gold)', fontWeight: 700 }}>CLICS RUTINA</div>
                  <div style={{ fontSize: 24, fontWeight: 700, margin: '4px 0' }}>1,210</div>
                  <span style={{ fontSize: 10, color: 'var(--color-muted-text)' }}>Botón "Comenzar"</span>
                </div>
                <div style={{ padding: 14, borderRadius: 12, background: '#fffaf7', border: '1px solid rgba(201,168,122,.2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--color-rose)', fontWeight: 700 }}>CONSULTAS GUÍA</div>
                  <div style={{ fontSize: 24, fontWeight: 700, margin: '4px 0' }}>842</div>
                  <span style={{ fontSize: 10, color: 'var(--color-muted-text)' }}>Ejercicios y mascarillas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 2: GESTIÓN DE ESCANEOS */}
      {tab === 'scans' && (
        <div className="fade-up">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Buscar por usuario, ID o tipo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(201,168,122,.3)',
                  background: 'white',
                  fontSize: 13,
                  width: '260px',
                }}
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: 12,
                  border: '1px solid rgba(201,168,122,.3)',
                  background: 'white',
                  fontSize: 13,
                }}
              >
                <option value="todos">Todos los análisis</option>
                <option value="facial">Solo Facial</option>
                <option value="labios">Solo Labios</option>
              </select>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted-text)', alignSelf: 'center' }}>
              Mostrando {filteredScans.length} registros
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(201,168,122,.25)', boxShadow: '0 8px 30px rgba(160,86,107,.06)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#fdf3ef', borderBottom: '1px solid rgba(201,168,122,.25)', color: 'var(--color-rose-deep)', fontSize: 11, letterSpacing: '0.06em' }}>
                    <th style={{ padding: '14px 18px' }}>ID</th>
                    <th style={{ padding: '14px 18px' }}>FECHA</th>
                    <th style={{ padding: '14px 18px' }}>USUARIO</th>
                    <th style={{ padding: '14px 18px' }}>TIPO</th>
                    <th style={{ padding: '14px 18px' }}>DIAGNÓSTICO</th>
                    <th style={{ padding: '14px 18px' }}>PRECISIÓN IA</th>
                    <th style={{ padding: '14px 18px' }}>ESTADO</th>
                    <th style={{ padding: '14px 18px' }}>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(201,168,122,.15)' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 600 }}>{s.id}</td>
                      <td style={{ padding: '14px 18px', color: 'var(--color-muted-text)' }}>{s.date}</td>
                      <td style={{ padding: '14px 18px' }}>{s.user}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.type === 'Labios' ? '#fbecef' : '#eaf2f8', color: s.type === 'Labios' ? 'var(--color-rose-deep)' : '#336699' }}>
                          {s.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <b>{s.skinType}</b>
                        <div style={{ fontSize: 11, color: 'var(--color-muted-text)' }}>{s.mainNeed}</div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#4f8562', fontWeight: 700 }}>{s.score}%</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: 11, color: s.status === 'Completado' ? '#4f8562' : '#c07a6a', fontWeight: 600 }}>
                          ● {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <button
                          onClick={() => setSelectedScan(s)}
                          style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid rgba(201,168,122,.4)', background: '#fff', fontSize: 11, cursor: 'pointer', fontWeight: 600, color: 'var(--color-rose-deep)' }}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Detalle */}
          {selectedScan && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{ background: '#fff', maxWidth: 480, width: '100%', borderRadius: 24, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(201,168,122,.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 className="font-display" style={{ margin: 0, fontSize: 22 }}>Escaneo {selectedScan.id}</h3>
                  <button onClick={() => setSelectedScan(null)} style={{ border: 0, background: 'none', fontSize: 18, cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'grid', gap: 12, fontSize: 13, marginBottom: 22 }}>
                  <div><b>Usuario:</b> {selectedScan.user}</div>
                  <div><b>Modalidad:</b> {selectedScan.type}</div>
                  <div><b>Tipo identificado:</b> {selectedScan.skinType}</div>
                  <div><b>Necesidad primordial:</b> {selectedScan.mainNeed}</div>
                  <div><b>Precisión estimada de IA:</b> {selectedScan.score}%</div>
                  <div><b>Estado clínico:</b> {selectedScan.status}</div>
                </div>
                <Button className="primary-button" style={{ width: '100%' }} onClick={() => setSelectedScan(null)}>
                  Cerrar Inspección
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 3: PROGRAMA LABIOS */}
      {tab === 'lips' && (
        <div className="fade-up">
          <div style={{ background: 'rgba(255,255,255,0.85)', padding: '26px', borderRadius: 20, border: '1px solid rgba(201,168,122,.25)', marginBottom: 24 }}>
            <span className="brand-label" style={{ fontSize: 9 }}>MÓDULO ACTIVO</span>
            <h2 className="font-display" style={{ fontSize: 24, margin: '6px 0 10px' }}>
              Selem Beauty: Labios más voluminosos naturales
            </h2>
            <p style={{ color: 'var(--color-muted-text)', fontSize: 14, lineHeight: 1.6, maxWidth: 680 }}>
              Gestión del contenido del programa «Acceso Completo» visible en la app para todos los usuarios.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {[
              { title: '1. Rutinas Diarias', desc: 'Mañana (bálsamo hidra), Día (SPF 30+), Noche (oclusivo regenerador)', count: '3 pasos configurados' },
              { title: '2. Ejercicios y técnicas', desc: 'Beso sostenido, sonrisa con resistencia y masaje circular activador', count: '3 técnicas activas' },
              { title: '3. Guía de productos', desc: 'Ácido hialurónico vegetal, manteca de karité, ceramidas y péptidos', count: '4 activos aprobados' },
              { title: '4. Mascarillas', desc: 'Mascarilla nocturna de miel/almendras y parche calmante aloe/pepino', count: '2 recetas guiadas' },
              { title: '5. Tips de cuidado', desc: 'Hidratación 2L, cero mordiscos y evitar irritantes con canela/chile', count: '3 consejos clave' },
            ].map(mod => (
              <div key={mod.title} style={{ background: '#fff', padding: '20px', borderRadius: 16, border: '1px solid rgba(201,168,122,.22)', borderTop: '3px solid var(--color-rose)' }}>
                <h3 className="font-display" style={{ fontSize: 17, margin: '0 0 6px' }}>{mod.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-muted-text)', lineHeight: 1.5, margin: '0 0 14px' }}>{mod.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#5f9872', fontWeight: 600 }}>✓ {mod.count}</span>
                  <button style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, border: '1px solid rgba(201,168,122,.3)', background: '#fffaf8', color: 'var(--color-rose-deep)', fontWeight: 600, cursor: 'pointer' }}>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 4: CATEGORÍAS Y RUTINAS */}
      {tab === 'routines' && (
        <div className="fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {SKIN_CATEGORIES.map(cat => (
              <div key={cat.key} style={{ background: 'rgba(255,255,255,0.85)', padding: '22px', borderRadius: 18, border: '1px solid rgba(201,168,122,.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 className="font-display" style={{ margin: 0, fontSize: 20 }}>{cat.name}</h3>
                  <span style={{ fontSize: 10, color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase' }}>Clave: {cat.key}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-muted-text)', margin: '8px 0 14px' }}>{cat.tagline}</p>
                <div style={{ fontSize: 12, marginBottom: 8 }}>
                  <b>Activos clave:</b> {cat.actives.slice(0, 3).join(', ')}...
                </div>
                <div style={{ fontSize: 12, color: '#a56155' }}>
                  <b>Evitar:</b> {cat.avoid.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 5: USUARIOS Y PLANES */}
      {tab === 'users' && (
        <div className="fade-up">
          <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(201,168,122,.25)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fdf3ef', borderBottom: '1px solid rgba(201,168,122,.25)', color: 'var(--color-rose-deep)', fontSize: 11 }}>
                  <th style={{ padding: '14px 18px' }}>USUARIO</th>
                  <th style={{ padding: '14px 18px' }}>EMAIL</th>
                  <th style={{ padding: '14px 18px' }}>PLAN ACTUAL</th>
                  <th style={{ padding: '14px 18px' }}>ESCANEOS</th>
                  <th style={{ padding: '14px 18px' }}>REGISTRADO</th>
                  <th style={{ padding: '14px 18px' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(201,168,122,.15)' }}>
                    <td style={{ padding: '14px 18px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-muted-text)' }}>{u.email}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: u.plan === 'Premium' ? 'var(--color-rose)' : '#eee', color: u.plan === 'Premium' ? '#fff' : '#666' }}>
                        {u.plan}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>{u.scans}</td>
                    <td style={{ padding: '14px 18px', color: 'var(--color-muted-text)' }}>{u.joined}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => toggleUserPlan(u.id)}
                        style={{ padding: '5px 10px', fontSize: 11, borderRadius: 8, border: '1px solid rgba(201,168,122,.35)', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        {u.plan === 'Premium' ? 'Degradar a Gratis' : 'Ascender a Premium'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 6: CONFIGURACIÓN */}
      {tab === 'settings' && (
        <div className="fade-up" style={{ maxWidth: 680 }}>
          <div style={{ background: 'rgba(255,255,255,0.85)', padding: '26px', borderRadius: 20, border: '1px solid rgba(201,168,122,.25)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 className="font-display" style={{ fontSize: 20, margin: 0 }}>Ajustes del Entorno</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(201,168,122,.15)' }}>
              <div>
                <b>Modo Desarrolladora / Acceso Completo Simulado</b>
                <div style={{ fontSize: 12, color: 'var(--color-muted-text)' }}>Permite acceso a todas las funciones sin requerir pasarela de pago.</div>
              </div>
              <input
                type="checkbox"
                checked={devMode}
                onChange={e => setDevMode(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid rgba(201,168,122,.15)' }}>
              <div>
                <b>Motor de Análisis de IA (TanStack Server Fn)</b>
                <div style={{ fontSize: 12, color: 'var(--color-muted-text)' }}>Modelos activos para análisis facial y morfología de labios.</div>
              </div>
              <span style={{ fontSize: 11, color: '#4f8562', fontWeight: 700 }}>● Activo</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>Base de Datos Supabase</b>
                <div style={{ fontSize: 12, color: 'var(--color-muted-text)' }}>Almacenamiento de sesiones y sincronización en la nube.</div>
              </div>
              <span style={{ fontSize: 11, color: '#4f8562', fontWeight: 700 }}>● Conectado</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
