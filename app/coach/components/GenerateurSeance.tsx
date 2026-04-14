'use client'

import { useState } from 'react'
import {
  genererSeance, seanceToText,
  type GenParams, type SeanceGeneree, type PhaseSeance,
  type Poste, type Objectif, type ATR, type Env, type MD, type Ressenti, type Douleur,
} from '../lib/exercises'

const PHASE_COLORS = ['#1565C0', '#0F6E56', '#C62828', '#4527A0', '#2E7D32']

function ChipGroup<T extends string>({
  label, options, value, onChange, colors,
}: {
  label: string
  options: { v: T; l: string }[]
  value: T
  onChange: (v: T) => void
  colors?: Record<string, string>
}) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {options.map(o => {
          const active = value === o.v
          const col = colors?.[o.v] || '#1A6FFF'
          return (
            <button
              key={o.v}
              onClick={() => onChange(o.v)}
              style={{
                padding: '5px 13px', borderRadius: '20px', border: `1px solid ${active ? col : '#2A2A3A'}`,
                background: active ? col + '25' : '#1A1A2A', color: active ? col : '#555',
                fontSize: '12px', fontWeight: active ? '700' : '500', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {o.l}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { v: string; l: string }[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555' }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: '#1A1A2A', border: '1px solid #2A2A3A', borderRadius: '8px',
          color: '#E0E0E0', fontSize: '13px', padding: '8px 10px', outline: 'none', width: '100%',
        }}
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function PhaseBlock({ phase, index, defaultOpen }: { phase: PhaseSeance; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const col = PHASE_COLORS[index] || '#1A6FFF'
  return (
    <div style={{ borderBottom: '1px solid #1C1C2C' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
      >
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#E0E0E0' }}>{phase.nom}</div>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '1px' }}>{phase.desc}</div>
        </div>
        <div style={{ fontSize: '11px', color: '#444', marginRight: '6px', whiteSpace: 'nowrap' }}>{phase.duree} · RPE {phase.rpe}</div>
        <span style={{ color: '#444', fontSize: '14px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '4px 16px 12px 50px' }}>
          {phase.exos.map((ex, ei) => (
            <div key={ei} style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: ei > 0 ? '1px solid #161620' : 'none', marginTop: ei > 0 ? '0' : undefined }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C', marginTop: '8px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#E0E0E0' }}>{ex.n}</div>
                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', lineHeight: '1.4' }}>{ex.d}</div>
                {ex.c && <div style={{ fontSize: '11px', color: '#C9A84C', marginTop: '3px', fontStyle: 'italic' }}>"{ex.c}"</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function GenerateurSeance() {
  const [poste, setPoste]       = useState<Poste>('milieu')
  const [niv, setNiv]           = useState('Semi-pro')
  const [md, setMd]             = useState<MD>('MD-4')
  const [obj, setObj]           = useState<Objectif>('vitesse')
  const [atr, setAtr]           = useState<ATR>('ACC')
  const [env, setEnv]           = useState<Env>('terrain')
  const [tps, setTps]           = useState(45)
  const [sem, setSem]           = useState(1)
  const [ressenti, setRessenti] = useState<Ressenti>('Frais')
  const [douleur, setDouleur]   = useState<Douleur>('Aucune')
  const [demande, setDemande]   = useState('')
  const [result, setResult]     = useState<SeanceGeneree | null>(null)
  const [copied, setCopied]     = useState(false)

  function generer() {
    const params: GenParams = { poste, niv, md, obj, atr, env, tps, sem, ressenti, douleur, demande }
    setResult(genererSeance(params))
    setCopied(false)
    setTimeout(() => {
      document.getElementById('gen-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function copier() {
    if (!result) return
    navigator.clipboard.writeText(seanceToText(result)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const ressentiColors: Record<Ressenti, string> = {
    'Frais': '#2ECC71', 'Normal': '#1A6FFF', 'Fatigué': '#FF6B35', 'Très fatigué': '#FF4757',
  }
  const douleurColors: Record<Douleur, string> = {
    'Aucune': '#2ECC71', 'Genou': '#FF4757', 'Ischios': '#FF4757',
    'Cheville': '#FF6B35', 'Adducteurs': '#FF6B35', 'Dos': '#FF6B35',
  }

  return (
    <div className="page-section">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '4px' }}>Générateur de séance</h1>
        <p style={{ color: '#444', fontSize: '13px' }}>Compose une séance personnalisée depuis ta bibliothèque d'exercices</p>
      </div>

      {/* ── Profil joueur ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#1A6FFF', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#1A6FFF', letterSpacing: '1px', textTransform: 'uppercase' }}>Joueur</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <SelectField label="Poste" value={poste} onChange={v => setPoste(v as Poste)} options={[
            { v: 'attaquant', l: 'Attaquant de pointe' },
            { v: 'ailier',    l: 'Ailier' },
            { v: 'milieu',    l: 'Milieu de terrain' },
            { v: 'lateral',   l: 'Latéral' },
            { v: 'defenseur', l: 'Défenseur central' },
            { v: 'gardien',   l: 'Gardien de but' },
          ]} />
          <SelectField label="Niveau" value={niv} onChange={setNiv} options={[
            { v: 'U12', l: 'U12' }, { v: 'U15', l: 'U15' }, { v: 'U17', l: 'U17' },
            { v: 'U19', l: 'U19' }, { v: 'Amateur', l: 'Amateur' },
            { v: 'Semi-pro', l: 'Semi-pro' }, { v: 'Pro', l: 'Pro' },
          ]} />
        </div>
      </div>

      {/* ── Paramètres séance ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#C9A84C', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#C9A84C', letterSpacing: '1px', textTransform: 'uppercase' }}>Séance</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <SelectField label="Jour MD" value={md} onChange={v => setMd(v as MD)} options={[
            { v: 'MD+3', l: 'MD+3' }, { v: 'MD+2', l: 'MD+2' }, { v: 'MD-4', l: 'MD-4' },
            { v: 'MD-2', l: 'MD-2' }, { v: 'MD-1', l: 'MD-1 Veille' }, { v: 'MD', l: 'MD Match' },
          ]} />
          <SelectField label="Phase ATR" value={atr} onChange={v => setAtr(v as ATR)} options={[
            { v: 'ACC', l: 'Accumulation' }, { v: 'TRA', l: 'Transmutation' },
            { v: 'REA', l: 'Réalisation' }, { v: 'DEC', l: 'Décharge' },
          ]} />
          <SelectField label="Semaine" value={String(sem)} onChange={v => setSem(Number(v))} options={
            Array.from({ length: 8 }, (_, i) => ({ v: String(i + 1), l: `S${i + 1}` }))
          } />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <SelectField label="Objectif" value={obj} onChange={v => setObj(v as Objectif)} options={[
            { v: 'vitesse',    l: 'Vitesse / Explosivité' },
            { v: 'force',      l: 'Force bas du corps' },
            { v: 'prevention', l: 'Prévention / Ischios' },
            { v: 'endurance',  l: 'Endurance / Conditioning' },
            { v: 'cod',        l: 'COD / Vivacité' },
            { v: 'technique',  l: 'Technique de course' },
            { v: 'frappe',     l: 'Frappe de balle' },
            { v: 'detente',    l: 'Détente / Jeu de tête' },
          ]} />
          <SelectField label="Environnement" value={env} onChange={v => setEnv(v as Env)} options={[
            { v: 'terrain', l: 'Terrain' },
            { v: 'salle',   l: 'Salle' },
            { v: 'maison',  l: 'Maison / PDC' },
          ]} />
          <SelectField label="Durée" value={String(tps)} onChange={v => setTps(Number(v))} options={[
            { v: '20', l: '20 min' }, { v: '45', l: '45 min' }, { v: '60', l: '60 min' },
          ]} />
        </div>
      </div>

      {/* ── État du joueur ── */}
      <div style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', padding: '20px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '3px', height: '16px', background: '#2ECC71', borderRadius: '2px' }} />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#2ECC71', letterSpacing: '1px', textTransform: 'uppercase' }}>État du joueur</span>
        </div>
        <ChipGroup<Ressenti>
          label="Ressenti"
          options={[
            { v: 'Frais', l: 'Frais' }, { v: 'Normal', l: 'Normal' },
            { v: 'Fatigué', l: 'Fatigué' }, { v: 'Très fatigué', l: 'Très fatigué' },
          ]}
          value={ressenti}
          onChange={setRessenti}
          colors={ressentiColors}
        />
        <ChipGroup<Douleur>
          label="Douleur / zone à protéger"
          options={[
            { v: 'Aucune', l: 'Aucune' }, { v: 'Genou', l: 'Genou' }, { v: 'Ischios', l: 'Ischios' },
            { v: 'Cheville', l: 'Cheville' }, { v: 'Adducteurs', l: 'Adducteurs' }, { v: 'Dos', l: 'Dos' },
          ]}
          value={douleur}
          onChange={setDouleur}
          colors={douleurColors}
        />
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>Demande spécifique (optionnel)</div>
          <textarea
            value={demande}
            onChange={e => setDemande(e.target.value)}
            placeholder="Ex : il veut progresser sur ses accélérations après dribbles, il a raté ses centres samedi..."
            rows={2}
            style={{
              width: '100%', background: '#1A1A2A', border: '1px solid #2A2A3A', borderRadius: '8px',
              color: '#E0E0E0', fontSize: '13px', padding: '10px 12px', outline: 'none', resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* ── Bouton ── */}
      <button
        onClick={generer}
        style={{
          width: '100%', background: '#1A6FFF', color: '#fff', border: 'none', borderRadius: '12px',
          padding: '14px', fontSize: '15px', fontWeight: '800', letterSpacing: '2px',
          textTransform: 'uppercase', cursor: 'pointer', marginBottom: '28px',
          transition: 'background 0.2s',
        }}
      >
        Générer la séance
      </button>

      {/* ── Résultat ── */}
      {result && (
        <div id="gen-result" style={{ background: '#141420', border: '1px solid #222238', borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1A3060)', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '18px', fontWeight: '900', color: '#C9A84C', letterSpacing: '0.5px', marginBottom: '4px' }}>{result.titre}</div>
            <div style={{ fontSize: '10px', color: '#90AAD4', letterSpacing: '1px', textTransform: 'uppercase' }}>{result.meta}</div>
          </div>
          {/* Barre de couleur des phases */}
          <div style={{ display: 'flex', height: '4px' }}>
            {result.phases.map((_, i) => (
              <div key={i} style={{ flex: i === 2 ? 2 : 1, background: PHASE_COLORS[i] }} />
            ))}
          </div>
          {/* Phases */}
          {result.phases.map((phase, i) => (
            <PhaseBlock key={i} phase={phase} index={i} defaultOpen={i === 2} />
          ))}
          {/* Message coach */}
          <div style={{ background: '#0D1B2A', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', fontSize: '13px', color: '#90AAD4', fontStyle: 'italic', lineHeight: '1.6' }}>
            <strong style={{ color: '#C9A84C', fontStyle: 'normal' }}>Stéphane : </strong>
            {result.msgFin} — {result.msgAtr}
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', margin: '12px 16px' }}>
            <button
              onClick={generer}
              style={{
                flex: 1, background: '#1A1A2A', border: '1px solid #1A6FFF50',
                color: '#1A6FFF', borderRadius: '8px', padding: '10px 16px',
                fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              🔄 Autre séance
            </button>
            <button
              onClick={copier}
              style={{
                flex: 1,
                background: copied ? '#2ECC71' : '#1A1A2A',
                border: `1px solid ${copied ? '#2ECC71' : '#2A2A3A'}`,
                color: copied ? '#fff' : '#888', borderRadius: '8px', padding: '10px 16px',
                fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {copied ? '✓ Copié !' : '📋 Copier'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
