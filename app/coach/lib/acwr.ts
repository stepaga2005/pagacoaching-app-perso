// ─── ACWR — Acute:Chronic Workload Ratio ─────────────────────────────────────
//
// Acute  = charge des 7 derniers jours   (Σ RPE des séances complétées)
// Chronic = charge moyenne des 28 derniers jours par semaine (Σ RPE / 4)
// ACWR = Acute / Chronic
//
// Zones :
//   < 0.8  → sous-charge (gris)
//   0.8–1.3 → zone optimale (vert)
//   1.3–1.5 → risque élevé (orange)
//   > 1.5  → risque très élevé (rouge)
//

export type AcwrResult = {
  acute: number
  chronic: number
  ratio: number | null   // null si pas assez de données chroniques
  zone: 'low' | 'optimal' | 'high' | 'danger' | 'nodata'
}

export const ACWR_ZONES = {
  low:     { label: 'Sous-charge',  color: '#555',   bg: '#55555518' },
  optimal: { label: 'Optimal',      color: '#2ECC71', bg: '#2ECC7118' },
  high:    { label: 'Risque élevé', color: '#FF6B35', bg: '#FF6B3518' },
  danger:  { label: 'Danger',       color: '#FF4757', bg: '#FF475718' },
  nodata:  { label: 'Pas de données', color: '#333', bg: '#1A1A1A'   },
}

type MinReal = {
  date_realisation: string
  completee: boolean
  rpe?: number | null
}

export function computeAcwr(realisations: MinReal[], refDate?: string): AcwrResult {
  const ref = refDate ?? new Date().toISOString().split('T')[0]
  const refD = new Date(ref + 'T12:00:00')

  const d7 = new Date(refD); d7.setDate(d7.getDate() - 6)
  const d28 = new Date(refD); d28.setDate(d28.getDate() - 27)

  const debut7  = d7.toISOString().split('T')[0]
  const debut28 = d28.toISOString().split('T')[0]

  // Séances avec RPE renseigné
  const withRpe = realisations.filter(r => r.completee && r.rpe != null)

  const acute = withRpe
    .filter(r => r.date_realisation >= debut7 && r.date_realisation <= ref)
    .reduce((sum, r) => sum + (r.rpe ?? 0), 0)

  const chronic28 = withRpe
    .filter(r => r.date_realisation >= debut28 && r.date_realisation <= ref)
    .reduce((sum, r) => sum + (r.rpe ?? 0), 0)

  const chronic = chronic28 / 4  // moyenne hebdo sur 4 semaines

  if (chronic < 1) {
    // Pas assez de données chroniques pour être significatif
    return { acute, chronic, ratio: null, zone: 'nodata' }
  }

  const ratio = Math.round((acute / chronic) * 100) / 100

  const zone: AcwrResult['zone'] =
    ratio < 0.8  ? 'low' :
    ratio <= 1.3 ? 'optimal' :
    ratio <= 1.5 ? 'high' : 'danger'

  return { acute, chronic, ratio, zone }
}

// Calcule l'ACWR semaine par semaine sur une période
export function computeAcwrHistory(
  realisations: MinReal[],
  weekEnds: string[]  // liste de dates (dimanche de chaque semaine)
): (AcwrResult & { date: string })[] {
  return weekEnds.map(date => ({ date, ...computeAcwr(realisations, date) }))
}
