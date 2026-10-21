import type { SkinAnalysis } from './analysis-types'
import { normalizeSkinAnalysis } from './skin-guide'

export type SavedScan = { id: string; date: string; photo: string; analysis: SkinAnalysis }
export type Journey = { beforeId: string; startedAt: string; afterId: string | null }

// Almacenamiento local (sin Supabase / Firebase pendiente de integración)
const SCANS_KEY = 'selem_scans'
const JOURNEY_KEY = 'selem_journey'

function loadScansFromStorage(): SavedScan[] {
  try {
    return JSON.parse(localStorage.getItem(SCANS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveScansToStorage(scans: SavedScan[]) {
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans))
}

export async function loadScan(id: string): Promise<SavedScan | null> {
  const scans = loadScansFromStorage()
  return scans.find((s) => s.id === id) ?? null
}

export async function loadJourney(): Promise<Journey | null> {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function saveScan(photo: string, analysis: SkinAnalysis): Promise<SavedScan> {
  const scan: SavedScan = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    photo,
    analysis: normalizeSkinAnalysis(analysis as never),
  }
  const scans = loadScansFromStorage()
  scans.unshift(scan)
  // Máximo 50 escaneos guardados localmente
  saveScansToStorage(scans.slice(0, 50))
  return scan
}

export async function saveJourney(j: Journey | null) {
  if (!j) {
    localStorage.removeItem(JOURNEY_KEY)
  } else {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(j))
  }
}

export function daysSince(iso: string) {
  return Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) + 1)
}
