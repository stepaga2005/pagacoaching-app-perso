// ─── Shared types & constants for the coach app ─────────────────────────────

export type Groupe = { id: string; nom: string; couleur: string; coach_id?: string }

export const GROUPE_COLORS = [
  '#1A6FFF', '#2ECC71', '#FF4757', '#C9A84C',
  '#9B59B6', '#FF6B9D', '#00CEC9', '#E17055',
]

export type Joueur = {
  id: string
  nom: string
  prenom: string
  email: string
  poste: string
  niveau: string
  club: string
  actif: boolean
  acces_debut: string
  acces_fin: string
  groupe_id?: string | null
}

export type Famille = { id: string; nom: string; couleur: string }

export type Exercice = {
  id: string
  nom: string
  famille_id: string
  description: string
  consignes_execution: string
  video_url: string
  materiel: string[]
  zone_musculaire: string[]
  type_effort: string
  position: string
  familles?: Famille
}

export type SetConfig = {
  reps?: number
  duree?: number
  dist?: number
  charge?: number
  recup?: number
}

export type SeanceExercice = {
  id?: string
  exercice_id: string
  ordre: number
  series?: number
  repetitions?: number
  duree_secondes?: number
  distance_metres?: number
  charge_kg?: number
  recuperation_secondes?: number
  recuperation_inter_sets?: number
  recuperation_active?: boolean
  lien_suivant?: boolean
  uni_podal?: boolean
  notes?: string
  sets_config?: SetConfig[]
  exercices?: { nom: string; familles?: { nom: string; couleur: string } }
}

export type Seance = {
  id: string
  nom: string
  type: string
  notes?: string
  est_template: boolean
  seance_exercices?: SeanceExercice[]
}

export type Programme = {
  id: string
  nom: string
  description?: string
  objectif?: string
}

export type SeanceProg = {
  id: string
  nom: string
  type: string
  jour_semaine: number
  semaine: number
  seance_exercices?: { id: string }[]
}

export type Realisation = {
  id: string
  seance_id: string | null
  activite_id?: string | null
  date_realisation: string
  completee: boolean
  duree_minutes?: number | null
  rpe?: number | null
  fatigue?: number | null
  courbatures?: number | null
  qualite_sommeil?: number | null
  notes_joueur?: string | null
  seances?: {
    id: string; nom: string; type: string; est_template: boolean
    seance_exercices?: {
      id: string; ordre: number; series?: number; repetitions?: number
      duree_secondes?: number; distance_metres?: number; charge_kg?: number
      recuperation_secondes?: number; lien_suivant?: boolean; notes?: string
      sets_config?: SetConfig[] | null
      exercices?: { nom: string; video_url?: string; consignes_execution?: string; familles?: { nom: string; couleur: string } | null } | null
    }[]
  } | null
  activites?: { nom: string } | null
}

export type MPSeanceExercice = {
  id: string
  ordre: number
  series?: number
  repetitions?: number
  duree_secondes?: number
  distance_metres?: number
  charge_kg?: number
  recuperation_secondes?: number
  recuperation_inter_sets?: number
  lien_suivant?: boolean
  uni_podal?: boolean
  notes?: string
  sets_config?: SetConfig[]
  exercices?: { nom: string; video_url?: string; consignes_execution?: string; familles?: { nom: string; couleur: string } | null } | null
}

export type MPRealisation = {
  id: string
  seance_id: string | null
  activite_id?: string | null
  date_realisation: string
  completee: boolean
  duree_minutes?: number | null
  rpe?: number | null
  fatigue?: number | null
  courbatures?: number | null
  qualite_sommeil?: number | null
  notes_joueur?: string | null
  seances?: { id: string; nom: string; type: string; est_template: boolean; seance_exercices?: MPSeanceExercice[] } | null
  activites?: { nom: string } | null
}

export type SemaineConfig = {
  pct: number
  remplacements: Record<number, { id: string; nom: string; familles?: { nom: string; couleur: string } | null }>
}

export type MsgType = {
  id: string; expediteur_id: string; destinataire_id: string
  contenu: string | null; media_url: string | null; media_type: string | null
  lu: boolean; created_at: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',    icon: '🏛️' },
  { id: 'joueurs',    label: 'Joueurs',       icon: '👥' },
  { id: 'exercices',  label: 'Exercices',     icon: '⚡' },
  { id: 'modeles',    label: 'Modèles',       icon: '🗓️' },
  { id: 'programmes', label: 'Séances',       icon: '📋' },
  { id: 'activites',  label: 'Activités',     icon: '🏃' },
  { id: 'generateur', label: 'Générateur',    icon: '🎯' },
  { id: 'messages',   label: 'Messages',      icon: '💬' },
]

export const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
export const JOURS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
export const TYPES_SEANCE = ['complete', 'echauffement', 'corps', 'retour_au_calme']
export const LABELS_TYPE: Record<string, string> = {
  complete: 'Complète', echauffement: 'Échauffement',
  corps: 'Corps de séance', retour_au_calme: 'Retour au calme',
}

export const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  complete:         { bg: '#1A6FFF18', border: '#1A6FFF50', text: '#6AAEFF' },
  echauffement:     { bg: '#2ECC7118', border: '#2ECC7150', text: '#2ECC71' },
  corps:            { bg: '#C9A84C18', border: '#C9A84C50', text: '#C9A84C' },
  retour_au_calme:  { bg: '#9B59B618', border: '#9B59B650', text: '#C39BD3' },
}
