// Import exercices depuis scripts/exercices.csv → Supabase
import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import { fileURLToPath } from 'url'
import path from 'path'

const supabase = createClient(
  'https://qafehxbbyfwxjkdrtcpe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZmVoeGJieWZ3eGprZHJ0Y3BlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY4OTU2MSwiZXhwIjoyMDkxMjY1NTYxfQ.23gIE0Qsy1-l-0d2Q69rHansxkBdxKNDDtzdp2OUsho'
)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_PATH = path.join(__dirname, 'exercices.csv')

// Mapping MAIN_CATEGORY CSV → nom de famille Supabase
const CATEGORY_TO_FAMILLE = {
  speed_max:          'Vitesse',
  acceleration:       'Accélération',
  cod:                'Changement de direction',
  plyometric_power:   'Pliométrie',
  coordination:       'Coordination',
  technique:          'Technique athlétique',
  conditioning:       'Cardio',
  hiit:               'Cardio',
  lower_body_strength:'Force',
  upper_body_pull:    'Force',
  upper_body_push:    'Force',
  arms_biceps:        'Force',
  arms_triceps:       'Force',
  shoulders:          'Force',
  trunk_extension:    'Force',
  core_abs:           'Force',
  core_static:        'Force',
  mobility:           'Mobilité',
  recovery:           'Stretching',
  prevention:         'Prévention',
  proprioception:     'Proprioception',
}

// Mapping EQUIPMENT CSV → materiel lisible
const EQUIPMENT_LABELS = {
  none:           null,
  cones:          'Cônes',
  hurdles:        'Haies',
  resistance_band:'Élastique',
  barbell:        'Barre',
  dumbbell:       'Haltères',
  kettlebell:     'Kettlebell',
  medicine_ball:  'Medecine ball',
  pull_up_bar:    'Barre de traction',
  bench:          'Banc',
  box:            'Box',
  agility_ladder: 'Échelle de coordination',
  wall:           'Mur',
  cable:          'Poulie',
  trx:            'TRX',
  foam_roller:    'Rouleau',
  mat:            'Tapis',
  swiss_ball:     'Swiss ball',
  step:           'Step',
}

async function parseCsv() {
  const exercises = []
  const rl = createInterface({ input: createReadStream(CSV_PATH), crlfDelay: Infinity })
  let lineNum = 0

  for await (const line of rl) {
    lineNum++
    if (lineNum <= 2) continue // skip title + header
    if (!line.trim()) continue

    const cols = line.split(';')
    const [
      EXERCISE_ID, EXERCISE_NAME, MAIN_CATEGORY, SUB_CATEGORY,
      OBJECTIVE_PRIMARY, OBJECTIVE_SECONDARY, ENVIRONMENT, EQUIPMENT,
      EQUIPMENT_LEVEL, PRIORITY, SESSION_ROLE, MOVEMENT_PATTERN,
      VECTOR, CONTRACTION_TYPE, INTENSITY, NEURAL_LOAD, MECHANICAL_LOAD,
      METABOLIC_LOAD, SOLO_ONLY, FOOTBALL_TRANSFER, COMPATIBLE_DAYS,
      LEVEL, AGE_GROUP, POSITION_RELEVANCE, CONTRAINDICATIONS, PROGRESSION_GROUP
    ] = cols

    if (!EXERCISE_NAME?.trim()) continue

    exercises.push({
      nom: EXERCISE_NAME.trim(),
      main_category: MAIN_CATEGORY?.trim() || null,
      equipment: EQUIPMENT?.trim() || null,
      level: LEVEL?.trim() || null,
    })
  }

  return exercises
}

async function main() {
  console.log('🚀 Import exercices depuis CSV...\n')

  // 1. Charger les familles existantes
  const { data: familles, error: errFam } = await supabase
    .from('familles').select('id, nom')

  if (errFam) { console.error('❌ Erreur familles:', errFam.message); process.exit(1) }

  // Index nom→id (case-insensitive)
  const familleMap = {}
  for (const f of familles) {
    familleMap[f.nom.toLowerCase()] = f.id
  }
  console.log(`📂 ${familles.length} familles chargées:`, familles.map(f => f.nom).join(', '))

  // 2. Charger les exercices existants (pour éviter doublons)
  const { data: existing, error: errEx } = await supabase
    .from('exercices').select('nom')

  if (errEx) { console.error('❌ Erreur chargement exercices:', errEx.message); process.exit(1) }

  const existingNames = new Set(existing.map(e => e.nom.toLowerCase().trim()))
  console.log(`📋 ${existingNames.size} exercices déjà en base\n`)

  // 3. Parser le CSV
  const csvExercises = await parseCsv()
  console.log(`📄 ${csvExercises.length} exercices dans le CSV\n`)

  // 4. Filtrer les nouveaux + construire les payloads
  const toInsert = []
  for (const ex of csvExercises) {
    if (existingNames.has(ex.nom.toLowerCase())) continue

    // Trouver famille_id
    const familleName = CATEGORY_TO_FAMILLE[ex.main_category] || null
    const famille_id = familleName ? (familleMap[familleName.toLowerCase()] || null) : null

    // Matériel lisible (colonne text[] dans Supabase → tableau)
    const materielLabel = EQUIPMENT_LABELS[ex.equipment] !== undefined
      ? EQUIPMENT_LABELS[ex.equipment]
      : (ex.equipment && ex.equipment !== 'none' ? ex.equipment : null)
    const materiel = materielLabel ? [materielLabel] : null

    toInsert.push({
      nom: ex.nom,
      famille_id,
      materiel,
    })
  }

  console.log(`➕ ${toInsert.length} nouveaux exercices à insérer (${csvExercises.length - toInsert.length} déjà présents)\n`)

  if (toInsert.length === 0) {
    console.log('✅ Rien à faire, tous les exercices sont déjà en base.')
    return
  }

  // 5. Insérer par lots de 100
  const BATCH = 100
  let inserted = 0
  let errors = 0

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH)
    const { error } = await supabase.from('exercices').insert(batch)

    if (error) {
      console.error(`❌ Lot ${Math.floor(i/BATCH)+1}: ${error.message}`)
      errors += batch.length
    } else {
      inserted += batch.length
      process.stdout.write(`\r  ✅ ${inserted}/${toInsert.length} insérés...`)
    }
  }

  console.log(`\n\n🎉 Import terminé ! ${inserted} exercices ajoutés, ${errors} erreurs.`)
}

main()
