import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface LipsPageProps {
  onStartScan: () => void
  onSignIn?: () => void
  userId?: string | null
}

const MODULES = [
  {
    id: 'rutinas',
    name: 'Rutinas',
    icon: 'drop',
    summary: 'Pasos diarios de mañana, día y noche para hidratar, proteger y mantener volumen natural.',
    items: [
      {
        title: 'Mañana · Despertar e Hidratar',
        product: 'Bálsamo sin fragancia con ácido hialurónico',
        how: 'Aplica sobre labios limpios con toquecitos suaves con la yema del dedo anular. Retiene la humedad inicial.',
      },
      {
        title: 'Durante el día · Protección Activa',
        product: 'Protector labial SPF 30 o superior',
        how: 'Aplica antes de salir al sol y reaplica cada 2-3 horas. El sol degrada el colágeno de los labios; el SPF previene la pérdida de grosor.',
      },
      {
        title: 'Noche · Sellado Regenerador',
        product: 'Vaselina pura o manteca de karité pura',
        how: 'Humedece ligeramente tus labios con agua y aplica una capa generosa antes de dormir para despertar con labios tersos y flexibles.',
      },
    ],
  },
  {
    id: 'ejercicios',
    name: 'Ejercicios y técnicas',
    icon: 'sparkle',
    summary: 'Gimnasia facial labial para estimular la microcirculación y tonificar los músculos peribucales.',
    items: [
      {
        title: '1. El beso sostenido (Plump natural)',
        product: 'Técnica de gimnasia facial',
        how: 'Frunce los labios hacia adelante como enviando un beso exagerado. Mantén la tensión durante 5 segundos y relaja. Realiza 10 repeticiones.',
      },
      {
        title: '2. Sonrisa con resistencia',
        product: 'Tonificación muscular',
        how: 'Sonríe ampliamente manteniendo los labios sellados. Coloca los dedos índice suavemente en las comisuras y resiste el movimiento durante 5 segundos. Repite 8 veces.',
      },
      {
        title: '3. Masaje circular activador',
        product: 'Estimulación linfática',
        how: 'Con un poco de bálsamo, realiza pequeños círculos con el pulpejo de los dedos desde el centro hacia las comisuras para estimular el riego sanguíneo.',
      },
    ],
  },
  {
    id: 'productos',
    name: 'Guía de productos',
    icon: 'shield',
    summary: 'Los mejores activos respaldados por la dermatología para un cuidado respetuoso y efectivo.',
    items: [
      {
        title: 'Ácido Hialurónico Vegetal',
        product: 'Efecto rellenador hidratante',
        how: 'Atrae agua a las capas externas de la mucosa labial creando un aspecto más turgente y relleno.',
      },
      {
        title: 'Manteca de Karité & Ceramidas',
        product: 'Refuerzo de barrera lipídica',
        how: 'Selladores que evitan la pérdida transepidérmica de agua y reparan grietas finas.',
      },
      {
        title: 'Péptidos bioactivos labiales',
        product: 'Estimulación de colágeno',
        how: 'Favorecen la elasticidad y densidad dérmica a mediano y largo plazo sin irritación.',
      },
    ],
  },
  {
    id: 'mascarillas',
    name: 'Mascarillas',
    icon: 'heart',
    summary: 'Tratamientos intensivos semanales para máxima suavidad y nutrición celular.',
    items: [
      {
        title: 'Mascarilla nocturna de Miel y Almendras',
        product: 'Tratamiento SOS nocturno',
        how: 'Mezcla media gota de miel pura con una gota de aceite de almendras dulces. Aplica antes de dormir y retira con agua tibia por la mañana.',
      },
      {
        title: 'Parche calmante de Aloe y Pepino',
        product: 'Refresco turgente exprés',
        how: 'Aplica gel de aloe puro durante 10 minutos. Aporta agua inmediata y un efecto relajado y luminoso en el contorno.',
      },
    ],
  },
  {
    id: 'tips',
    name: 'Tips de cuidado',
    icon: 'sun',
    summary: 'Hábitos diarios clave para mantener labios sanos, carnosos y luminosos.',
    items: [
      {
        title: 'Hidratación celular interna',
        product: 'Hábito diario',
        how: 'Toma al menos 2 litros de agua al día. Los labios son los primeros en mostrar signos de deshidratación corporal.',
      },
      {
        title: 'Nunca lamer ni morder los labios',
        product: 'Hábito preventivo',
        how: 'La saliva contiene enzimas amilasa que resecan e irritan la delicada piel de los labios, haciéndolos lucir opacos y secos.',
      },
      {
        title: 'Evitar plumpers con canela o chile',
        product: 'Protección dermatológica',
        how: 'La inflamación por irritantes no es volumen saludable; desgasta la barrera y produce envejecimiento prematuro.',
      },
    ],
  },
]

export function LipsPage({ onStartScan, onSignIn, userId }: LipsPageProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  const activeModuleData = MODULES.find(m => m.id === selectedModule)

  return (
    <main className="page-shell fade-up" style={{ paddingTop: '110px', paddingBottom: '90px' }}>
      {/* Encabezado */}
      <div className="center-heading" style={{ maxWidth: 740, marginBottom: 28 }}>
        <p className="font-script section-script" style={{ fontSize: 34, marginBottom: 4 }}>
          Selem Beauty
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 50px)', lineHeight: 1.15, margin: '8px 0 16px' }}>
          Labios más voluminosos naturales
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--color-muted-text)', maxWidth: 640, margin: '0 auto' }}>
          Rutinas y productos naturales para conseguir labios más llenos, definidos y luminosos sin procedimientos invasivos. Labios con más Volumen Perfecto para comenzar tu transformación.
        </p>
      </div>

      {/* Tarjeta destacada Acceso Completo */}
      <div className="pricing-grid single-plan" style={{ maxWidth: 440, margin: '0 auto 40px' }}>
        <article className="price-card featured" style={{ textAlign: 'center', padding: '42px 28px 34px', position: 'relative' }}>
          <span className="popular-label" style={{ letterSpacing: '0.18em' }}>
            ACCESO COMPLETO
          </span>

          <h2 className="font-display" style={{ fontSize: 26, margin: '14px 0 6px', color: 'var(--color-charcoal)' }}>
            Labios con más Volumen
          </h2>
          <p style={{ color: 'var(--color-rose-deep)', fontSize: 13, fontWeight: 600, margin: '0 0 24px' }}>
            Perfecto para comenzar tu transformación
          </p>

          <ul
            style={{
              margin: '0 auto 28px',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              textAlign: 'left',
              maxWidth: 290,
            }}
          >
            {[
              { label: 'Rutinas', id: 'rutinas' },
              { label: 'Ejercicios y tecnicas', id: 'ejercicios' },
              { label: 'Guía de productos', id: 'productos' },
              { label: 'Mascarillas', id: 'mascarillas' },
              { label: 'Tips de cuidado', id: 'tips' },
            ].map(item => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 15,
                  color: 'var(--color-charcoal)',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '10px',
                  transition: 'background .2s',
                }}
                onClick={() => setSelectedModule(selectedModule === item.id ? null : item.id)}
                title="Haz clic para ver detalles"
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(95, 152, 114, 0.15)',
                      color: '#4f8562',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-rose-deep)', fontWeight: 600 }}>
                  {selectedModule === item.id ? 'Cerrar' : 'Ver'}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              className="primary-button"
              style={{ width: '100%', fontSize: 15, padding: '15px 22px' }}
              onClick={onStartScan}
            >
              Comenzar Rutina
            </button>

            <button
              className="secondary-button"
              style={{ width: '100%', fontSize: 13, padding: '12px 18px' }}
              onClick={() => setSelectedModule(selectedModule ? null : 'rutinas')}
            >
              {selectedModule ? 'Ocultar guía detallada' : 'Explorar guía completa'}
            </button>
          </div>
        </article>
      </div>

      {/* Módulo desplegado con los detalles */}
      {activeModuleData && (
        <section
          className="fade-up"
          style={{
            maxWidth: 820,
            margin: '0 auto 40px',
            padding: '28px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(201, 168, 122, 0.35)',
            boxShadow: '0 12px 35px rgba(160, 86, 107, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="brand-label" style={{ fontSize: 9, letterSpacing: '0.15em' }}>
                CONTENIDO DEL PROGRAMA
              </span>
              <h2 className="font-display" style={{ fontSize: 26, margin: '4px 0' }}>
                {activeModuleData.name}
              </h2>
              <p style={{ color: 'var(--color-muted-text)', fontSize: 14, margin: 0 }}>
                {activeModuleData.summary}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSelectedModule(null)}
              style={{ fontSize: 12, color: 'var(--color-rose-deep)' }}
            >
              ✕ Cerrar
            </Button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 16,
              marginTop: 20,
            }}
          >
            {activeModuleData.items.map((step, idx) => (
              <article
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: '#fffaf8',
                  border: '1px solid rgba(201, 168, 122, 0.25)',
                  borderTop: '3px solid var(--color-rose)',
                }}
              >
                <h3 className="font-display" style={{ fontSize: 18, margin: '0 0 8px', color: 'var(--color-charcoal)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-rose-deep)', fontWeight: 600, fontSize: 13, margin: '0 0 8px' }}>
                  {step.product}
                </p>
                <p style={{ color: 'var(--color-muted-text)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  {step.how}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Nota informativa de cuidado natural */}
      <div
        className="ai-disclaimer"
        style={{ maxWidth: 640, margin: '20px auto 0', textAlign: 'center' }}
      >
        <span>
          <b>Cuidado natural y progresivo:</b> Las técnicas y productos hidratan y fortalecen los tejidos para unos labios visiblemente más suaves, tersos y definidos sin recurrir a tratamientos invasivos.
        </span>
      </div>
    </main>
  )
}
