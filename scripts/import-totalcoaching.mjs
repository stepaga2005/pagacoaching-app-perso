// Import session TotalCoaching → Supabase comme séance favorite
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://qafehxbbyfwxjkdrtcpe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZmVoeGJieWZ3eGprZHJ0Y3BlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY4OTU2MSwiZXhwIjoyMDkxMjY1NTYxfQ.23gIE0Qsy1-l-0d2Q69rHansxkBdxKNDDtzdp2OUsho'
)

const parseRecup = (str) => {
  const [mm, ss] = str.replace(' min', '').split(':').map(Number)
  return mm * 60 + (ss || 0)
}

const SESSION_NOM = 'TotalCoaching — Vendredi'
const SESSION_TYPE = 'complete'

// IDs des familles Supabase (stables)
const FAM = {
  vitesse:          'ec8fc653-3c5b-4e15-b31a-1e4ed0d8e0c5',
  force:            '29173d0b-3ce0-4685-999b-765b6b7745f8',
  puissance:        '79d6824d-2a73-4179-9b82-4d0dc73086dc',
  coordination:     '8e705d37-a844-4b3d-913e-606174b8e22f',
  appuis:           '4c12daf8-b26f-4c61-94ba-d5fb43b5c3e5',
  mobilite:         'd766f829-2920-4f21-89ee-4f1d3dab7d3c',
  stretch:          '56d7b0cf-3043-4019-819a-a4af0d2b3f0d',
  acceleration:     'a27e5eaf-5543-42c5-ad6a-1b91266c4790',
  deceleration:     '226c71e7-5f18-4dbb-bb43-954e0afbffc4',
  pliometrie:       '0c3f9f8a-d443-40c4-898c-ce6967e23a67',
  technique_base:   '9a60558e-c5b4-4729-ab94-8464590f6103',
  technique_athle:  '9d0fd749-3e89-439d-b73d-582c3d5a0aca',
  prevention:       '49536ec2-dd8d-41df-8da8-5994f25b2411',
  cod:              'a64e7e74-c0e3-438d-b0a4-bdfea4d8ebfd',
  cardio:           '1ab72a68-5322-4595-82bb-6e6958b7c1a7',
  proprioception:   '6a8301ed-a732-432d-a19e-428cf601fbc6',
}

// Pour chaque nouvel exercice, ajouter famille_id: FAM.xxx
const EXERCICES = [
  {
    nom: 'Échauffement 1',
    famille_id: FAM.mobilite,
    séries: [{ reps: 1, recup: parseRecup('2:00 min') }],
  },
  {
    nom: 'Side jumps plus rotations',
    famille_id: FAM.coordination,
    séries: [
      { duree: 15, recup: 0 }, { duree: 15, recup: 0 },
      { duree: 15, recup: 0 }, { duree: 15, recup: 0 },
    ],
  },
  {
    nom: 'Pliométrie genoux poitrine latéral',
    famille_id: FAM.pliometrie,
    consignes: "La moitié des reps dans un sens et l'autre moitié dans l'autre sens",
    séries: [{ reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }],
  },
  {
    nom: 'Vitesse en ligne droite',
    famille_id: FAM.vitesse,
    séries: [
      { dist: 20, recup: 60 }, { dist: 30, recup: 60 },
      { dist: 40, recup: 60 }, { dist: 50, recup: 120 },
    ],
  },
  {
    nom: 'Intermittent 30-30',
    famille_id: FAM.cardio,
    séries: Array.from({ length: 8 }, () => ({ dist: 150, recup: 30 })),
  },
  {
    nom: 'Sumo squat jump',
    famille_id: FAM.pliometrie,
    séries: [{ reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }],
  },
  {
    nom: 'Lunge jump répétées',
    famille_id: FAM.pliometrie,
    consignes: 'Travail identique pour chaque côté',
    séries: [{ reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }, { reps: 6, recup: 0 }],
  },
  {
    nom: 'Vitesse en ligne droite (descente)',
    famille_id: FAM.vitesse,
    séries: [
      { dist: 50, recup: 60 }, { dist: 40, recup: 60 },
      { dist: 30, recup: 60 }, { dist: 20, recup: 120 },
    ],
  },
  {
    nom: 'Intermittent 20-20 navette',
    famille_id: FAM.cardio,
    consignes: "Parcourir la distance en 10 sec aller et 10 sec retour. Récup 20 sec.",
    séries: [
      ...Array.from({ length: 11 }, () => ({ dist: 52, recup: 20 })),
      { dist: 52, recup: 180 },
    ],
  },
  {
    nom: 'Élastique fente arrière jump + accélération',
    famille_id: FAM.acceleration,
    consignes: 'Idem pour chaque jambe + Vitesse 20 mètres',
    séries: [
      { reps: 10, recup: 30 }, { reps: 10, recup: 30 },
      { reps: 10, recup: 30 }, { reps: 10, recup: 60 },
    ],
  },
  {
    nom: 'Intermittent 10-10 navette',
    famille_id: FAM.cardio,
    consignes: '24 mètres en 5 secondes aller et 24 mètres en 5 secondes retour',
    séries: [
      ...Array.from({ length: 15 }, () => ({ dist: 28, recup: 10 })),
      { dist: 28, recup: 180 },
    ],
  },
  {
    nom: 'Abs rameur axe',
    famille_id: FAM.force,
    séries: [{ duree: 45, recup: 15 }, { duree: 45, recup: 15 }, { duree: 45, recup: 15 }],
  },
]

async function main() {
  console.log('🚀 Import session TotalCoaching...\n')

  // Supprimer la séance créée précédemment (ratée) si elle existe
  await supabase.from('seances').delete().eq('nom', SESSION_NOM).eq('est_template', true)

  // 1. Créer la séance
  const { data: seance, error: errSeance } = await supabase
    .from('seances')
    .insert({ nom: SESSION_NOM, type: SESSION_TYPE, est_template: true })
    .select().single()

  if (errSeance) { console.error('❌ Erreur création séance:', errSeance.message); process.exit(1) }
  console.log(`✅ Séance créée: "${seance.nom}"`)

  // 2. Pour chaque exercice
  for (let idx = 0; idx < EXERCICES.length; idx++) {
    const exo = EXERCICES[idx]
    const s0 = exo.séries[0]

    // Chercher exercice existant
    const { data: existing } = await supabase
      .from('exercices').select('id').ilike('nom', exo.nom).maybeSingle()

    let exoId
    if (existing) {
      exoId = existing.id
      console.log(`  🔍 Trouvé: "${exo.nom}"`)
    } else {
      const { data: newExo, error: errExo } = await supabase
        .from('exercices')
        .insert({ nom: exo.nom, consignes_execution: exo.consignes || null, famille_id: exo.famille_id || null })
        .select().single()
      if (errExo) { console.error(`  ❌ "${exo.nom}":`, errExo.message); continue }
      exoId = newExo.id
      console.log(`  ➕ Créé: "${exo.nom}"`)
    }

    // Construire sets_config
    const sets_config = exo.séries.map(s => ({
      ...(s.reps != null ? { reps: s.reps } : {}),
      ...(s.duree != null ? { duree: s.duree } : {}),
      ...(s.dist != null ? { dist: s.dist } : {}),
      ...(s.charge != null ? { charge: s.charge } : {}),
      ...(s.recup != null ? { recup: s.recup } : {}),
    }))

    // Insérer d'abord sans sets_config pour tester
    const payload = {
      seance_id: seance.id,
      exercice_id: exoId,
      ordre: idx + 1,
      series: exo.séries.length,
      repetitions: s0.reps ?? null,
      duree_secondes: s0.duree ?? null,
      distance_metres: s0.dist ?? null,
      charge_kg: s0.charge ?? null,
      recuperation_secondes: s0.recup ?? null,
    }

    // Tenter avec sets_config
    const { error: errSE } = await supabase.from('seance_exercices').insert({ ...payload, sets_config })

    if (errSE && errSE.message.includes('sets_config')) {
      // Fallback sans sets_config
      const { error: errSE2 } = await supabase.from('seance_exercices').insert(payload)
      if (errSE2) console.error(`  ❌ Erreur: ${errSE2.message}`)
      else console.log(`  ✅ Exo ${idx + 1}/${EXERCICES.length} (sans sets_config — migration manquante)`)
    } else if (errSE) {
      console.error(`  ❌ Erreur: ${errSE.message}`)
    } else {
      console.log(`  ✅ Exo ${idx + 1}/${EXERCICES.length} avec sets_config`)
    }
  }

  console.log('\n🎉 Import terminé ! La séance apparaît dans Favoris.')
}

main()
