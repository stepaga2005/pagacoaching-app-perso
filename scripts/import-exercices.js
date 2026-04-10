#!/usr/bin/env node
/**
 * Usage: node scripts/import-exercices.js scripts/exercices.csv
 * Génère: scripts/import_exercices.sql  (à coller dans Supabase SQL Editor)
 */

const fs = require('fs')
const path = require('path')

const csvPath = process.argv[2]
if (!csvPath) {
  console.error('Usage: node scripts/import-exercices.js <chemin_csv>')
  process.exit(1)
}

// Mapping MAIN_CATEGORY → nom de famille dans Supabase
const CATEGORY_MAP = {
  speed_max:            'Vitesse',
  acceleration:         'Accélération',
  cod:                  'COD',
  coordination:         'Coordination',
  plyometric_power:     'Pliométrie',
  lower_body_strength:  'Force',
  upper_body_push:      'Force',
  upper_body_pull:      'Force',
  core_abs:             'Force',
  core_static:          'Force',
  trunk_extension:      'Force',
  shoulders:            'Force',
  arms_biceps:          'Force',
  arms_triceps:         'Force',
  prevention:           'Prévention',
  proprioception:       'Proprioception',
  mobility:             'Mobilité',
  conditioning:         'Cardio',
  hiit:                 'Cardio',
  recovery:             'Stretch',
  technique:            'Technique de base',
}

function fixEncoding(str) {
  return str
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/)
  if (lines.length === 0) return []

  // Détecte le séparateur
  const firstLine = lines[0]
  const sep = firstLine.includes(';') ? ';' : ','

  // Cherche la ligne d'en-têtes (celle qui contient EXERCISE_NAME ou NAME)
  let headerIdx = 0
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].toUpperCase().includes('EXERCISE_NAME') || lines[i].toUpperCase().includes('EXERCISE_ID')) {
      headerIdx = i
      break
    }
  }

  const headers = lines[headerIdx].split(sep).map(h => h.trim().replace(/^"|"$/g, ''))
  console.log('Colonnes détectées:', headers.slice(0, 8).join(', '), '...')

  const rows = []
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    const values = splitCSVLine(lines[i], sep)
    const row = {}
    headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim().replace(/^"|"$/g, '') })
    rows.push(row)
  }
  return rows
}

function splitCSVLine(line, sep) {
  const result = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === sep && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function escape(str) {
  if (!str) return 'NULL'
  return "'" + str.replace(/'/g, "''") + "'"
}

function escapeArray(str) {
  if (!str) return 'NULL'
  if (str === 'none') return "'{none}'"
  // Valeurs séparées par virgule → array PostgreSQL
  return "'" + '{' + str.replace(/'/g, "''") + '}' + "'"
}

// Lit le fichier (essaie UTF-8, puis latin1)
let raw
try {
  raw = fs.readFileSync(csvPath, 'utf8')
  // Retire le BOM UTF-8 si présent
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1)
} catch {
  raw = fs.readFileSync(csvPath, 'latin1')
}

const rows = parseCSV(raw)
console.log(`\n${rows.length} exercices trouvés\n`)

// Détecte les colonnes dynamiquement
const sample = rows[0] || {}
const keys = Object.keys(sample)

function findCol(...candidates) {
  for (const c of candidates) {
    const found = keys.find(k => k.toUpperCase() === c.toUpperCase())
    if (found) return found
  }
  return null
}

const COL_NAME     = findCol('EXERCISE_NAME', 'NAME', 'NOM', 'EXERCICE')
const COL_CAT      = findCol('MAIN_CATEGORY', 'CATEGORY', 'CATEGORIE', 'FAMILLE')
const COL_OBJ1     = findCol('OBJECTIVE_PRIMARY', 'OBJECTIVE', 'OBJECTIF_PRIMAIRE', 'OBJECTIF')
const COL_OBJ2     = findCol('OBJECTIVE_SECONDARY', 'OBJECTIF_SECONDAIRE')
const COL_EQUIP    = findCol('EQUIPMENT', 'MATERIEL', 'MATERIAL')
const COL_MUSCLE   = findCol('MOVEMENT_PATTERN', 'MUSCLE', 'ZONE_MUSCULAIRE', 'MUSCLES')
const COL_EFFORT   = findCol('CONTRACTION_TYPE', 'TYPE_EFFORT', 'EFFORT', 'INTENSITY')
const COL_POSITION = findCol('POSITION', 'POSTURE')

console.log('Colonnes mappées:')
console.log('  Nom:          ', COL_NAME || '⚠ NON TROUVÉ')
console.log('  Catégorie:    ', COL_CAT  || '⚠ NON TROUVÉ')
console.log('  Objectif 1:   ', COL_OBJ1 || '(vide)')
console.log('  Objectif 2:   ', COL_OBJ2 || '(vide)')
console.log('  Matériel:     ', COL_EQUIP || '(vide)')
console.log('  Zone muscu:   ', COL_MUSCLE || '(vide)')
console.log('  Type effort:  ', COL_EFFORT || '(vide)')
console.log('  Position:     ', COL_POSITION || '(vide)')
console.log('')

const unknownCategories = new Set()

// Collecte toutes les familles utilisées
const famillesUsed = new Set()
rows.forEach(row => {
  const cat = (row[COL_CAT] || '').toLowerCase().trim()
  const famille = CATEGORY_MAP[cat]
  if (famille) famillesUsed.add(famille)
  else if (cat) unknownCategories.add(cat)
})

if (unknownCategories.size > 0) {
  console.log('⚠ Catégories inconnues (mappées vers NULL):', [...unknownCategories].join(', '))
  console.log('')
}

// Génère le SQL
const outPath = path.join(path.dirname(csvPath), 'import_exercices.sql')
const lines = []

lines.push('-- Script généré automatiquement')
lines.push('-- Colle ce contenu dans Supabase > SQL Editor et clique Run')
lines.push('')
lines.push('DO $$')
lines.push('DECLARE')
lines.push('  fid uuid;')
lines.push('BEGIN')
lines.push('')

rows.forEach((row, i) => {
  const nom = fixEncoding(row[COL_NAME] || `Exercice ${i+1}`)
  const cat = ((row[COL_CAT] || '')).toLowerCase().trim()
  const famille = CATEGORY_MAP[cat]

  let description = ''
  if (COL_OBJ1 && row[COL_OBJ1]) description += row[COL_OBJ1]
  if (COL_OBJ2 && row[COL_OBJ2]) description += (description ? ' | ' : '') + row[COL_OBJ2]
  description = fixEncoding(description)

  const materiel     = fixEncoding(COL_EQUIP    ? row[COL_EQUIP]    || '' : '')
  const zone_musc    = fixEncoding(COL_MUSCLE   ? row[COL_MUSCLE]   || '' : '')
  const type_effort  = fixEncoding(COL_EFFORT   ? row[COL_EFFORT]   || '' : '')
  const position     = fixEncoding(COL_POSITION ? row[COL_POSITION] || '' : '')

  if (famille) {
    lines.push(`  SELECT id INTO fid FROM familles WHERE nom = '${famille.replace(/'/g, "''")}' LIMIT 1;`)
  } else {
    lines.push(`  fid := NULL;`)
  }

  lines.push(`  INSERT INTO exercices (nom, famille_id, description, materiel, zone_musculaire, type_effort, position)`)
  lines.push(`  VALUES (${escape(nom)}, fid, ${escape(description)}, ${escapeArray(materiel)}, ${escapeArray(zone_musc)}, ${escapeArray(type_effort)}, ${escapeArray(position)});`)
  lines.push('')
})

lines.push('END $$;')
lines.push('')
lines.push(`SELECT COUNT(*) as total_exercices FROM exercices;`)

fs.writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log(`✅ SQL généré: ${outPath}`)
console.log(`   ${rows.length} exercices`)
console.log('')
console.log('Prochaine étape:')
console.log('  1. Ouvre Supabase > SQL Editor')
console.log('  2. Colle le contenu de import_exercices.sql')
console.log('  3. Clique Run')
