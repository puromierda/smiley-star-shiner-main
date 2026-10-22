import { supabase } from '@/integrations/supabase/client'
import type { SkinAnalysis } from './analysis-types'
import { normalizeSkinAnalysis } from './skin-guide'

export type SavedScan = { id: string; date: string; photo: string; analysis: SkinAnalysis }
export type Journey = { beforeId: string; startedAt: string; afterId: string | null }

type Row = { id: string; created_at: string; photo: string; analysis: unknown }
const toScan = (r: Row): SavedScan => ({ id: r.id, date: r.created_at, photo: r.photo, analysis: normalizeSkinAnalysis(r.analysis as never) })

export async function loadScan(id: string): Promise<SavedScan | null> {
  const { data } = await supabase.from('scans').select('id, created_at, photo, analysis').eq('id', id).maybeSingle()
  return data ? toScan(data as Row) : null
}

export async function loadJourney(): Promise<Journey | null> {
  const { data } = await supabase.from('journeys').select('before_id, after_id, started_at').maybeSingle()
  return data ? { beforeId: data.before_id, afterId: data.after_id, startedAt: data.started_at } : null
}

export async function saveScan(photo: string, analysis: SkinAnalysis): Promise<SavedScan> {
  const { data, error } = await supabase.from('scans').insert({ photo, analysis: analysis as never }).select('id, created_at, photo, analysis').single()
  if (error || !data) throw error ?? new Error('No se pudo guardar')
  return toScan(data as Row)
}

export async function saveJourney(j: Journey | null) {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return
  if (!j) { await supabase.from('journeys').delete().eq('user_id', u.user.id); return }
  await supabase.from('journeys').upsert({ user_id: u.user.id, before_id: j.beforeId, after_id: j.afterId, started_at: j.startedAt })
}

export function daysSince(iso: string) {
  return Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) + 1)
}
