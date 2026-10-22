import type { SkinAnalysis } from './analysis-types'
import { normalizeSkinAnalysis } from './skin-guide'

export type SavedScan = { id: string; date: string; photo: string; analysis: SkinAnalysis }
export type Journey = { beforeId: string; startedAt: string; afterId: string | null }

const SCANS_KEY = 'selem_scans'
const JOURNEY_KEY = 'selem_journey'

/** Returns false when running in SSR (Node.js), true in the browser */
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

function getScans(): Record<string, SavedScan> {
  if (!isBrowser) return {}
  try {
    return JSON.parse(localStorage.getItem(SCANS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export async function loadScan(id: string): Promise<SavedScan | null> {
  if (!isBrowser) return null
  const scans = getScans()
  const s = scans[id]
  if (!s) return null
  return { ...s, analysis: normalizeSkinAnalysis(s.analysis as never) }
}

export async function loadJourney(): Promise<Journey | null> {
  if (!isBrowser) return null
  try {
    const raw = localStorage.getItem(JOURNEY_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Journey
  } catch {
    return null
  }
}

export async function saveScan(photo: string, analysis: SkinAnalysis): Promise<SavedScan> {
  const id = `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const date = new Date().toISOString()
  const scan: SavedScan = { id, date, photo, analysis }
  if (isBrowser) {
    const scans = getScans()
    scans[id] = scan
    localStorage.setItem(SCANS_KEY, JSON.stringify(scans))
  }
  return scan
}

export async function saveJourney(j: Journey | null) {
  if (!isBrowser) return
  if (!j) {
    localStorage.removeItem(JOURNEY_KEY)
  } else {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(j))
  }
}

export function daysSince(iso: string) {
  return Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) + 1)
}
