# Guide de debug — PAGACOACHING

## Architecture en 30 secondes

```
app/
├── coach/page.tsx      ← TOUT le coach (4000+ lignes, composants inline)
├── joueur/page.tsx     ← Vue joueur
├── login/page.tsx      ← Authentification
└── api/                ← Routes serveur (push, création joueur...)

lib/
├── supabase.ts         ← Client Supabase (anon key)
├── schema.sql          ← Structure DB (référence, ne pas exécuter en prod)
└── push.ts             ← Notifications push

scripts/
└── import-totalcoaching.mjs   ← Import séances depuis PDF

app/globals.css         ← Tout le design system (classes CSS)
```

---

## 1. Bug d'affichage / UI cassée

### Symptômes
- Element invisible, coupé, mal positionné
- Sidebar absente sur desktop
- Bouton qui ne répond pas

### Où regarder
1. **`app/globals.css`** → chercher la classe concernée (`.sidebar`, `.btn-primary`, `.nav-item`...)
2. **`app/coach/page.tsx`** → chercher le composant (Ctrl+F le nom : `function Dashboard`, `function Modeles`...)
3. **DevTools Chrome** → Inspect → onglet Computed pour voir quelle règle CSS s'applique

### Règles à ne pas casser
- La sidebar desktop est visible via `@media (min-width: 768px) { .sidebar { transform: translateX(0) !important } }`
- Le contenu principal a `className="main-content"` qui ajoute `margin-left: 220px` sur desktop
- Chaque composant a `className="page-section"` qui déclenche l'animation fadeUp

---

## 2. Bug de données / rien ne s'affiche

### Symptômes
- Liste vide alors que la DB a des données
- Erreur "Cannot read properties of undefined"
- Données qui ne se rechargent pas après une action

### Où regarder
1. **Console navigateur** (F12 → Console) → chercher les erreurs en rouge
2. **Supabase Dashboard** → Table Editor → vérifier que la donnée existe bien
3. **Dans le composant** → trouver la fonction `loadXxx()` et regarder la requête

### Exemple de requête type
```js
// Dans coach/page.tsx
const { data, error } = await supabase
  .from('seances')
  .select('*, seance_exercices(*)')
  .eq('est_template', true)

// Si error → l'afficher : console.log(error.message)
// Si data est null → vérifier les RLS Supabase
```

### Checklist données vides
- [ ] La RLS (Row Level Security) bloque-t-elle ? → Supabase → Authentication → Policies
- [ ] Le `useEffect` appelle-t-il bien `loadData()` au montage ?
- [ ] Le filtre `.eq()` est-il correct ? (ex: mauvais `est_template`)
- [ ] La colonne existe-t-elle ? (ex: `sets_config` nécessite une migration)

---

## 3. Bug après modification d'un composant

### Règle d'or
**Lire le composant entier avant de modifier quoi que ce soit.**  
Tous les composants sont dans `coach/page.tsx` — ils partagent des types et des fonctions.

### Composants et leur localisation (Ctrl+F)
| Composant | Chercher |
|---|---|
| Navigation / shell | `export default function CoachPage` |
| Dashboard | `function Dashboard()` |
| Joueurs | `function Joueurs()` |
| Exercices | `function Exercices()` |
| Modèles (semaine-type) | `function Modeles()` |
| Attribution modèle joueur | `function AssignProgrammeModal` |
| Séances templates | `function Programmes()` |
| Éditeur de séance | `function EditeurSeance` |
| Duplication avec progression | `function DuplicationModal` |
| Attribution séances isolées | `function AttributionModal` |
| Planning coach | `function PlanningCoach` |
| Master Planner | chercher `MasterPlanner` |
| Messages | `function Messages` |

### Vérifier après chaque modif
```bash
# Dans le terminal, depuis le dossier du projet
node -e "
const {execSync} = require('child_process');
try {
  execSync('./node_modules/.bin/tsc --noEmit 2>&1', {timeout: 30000});
  console.log('✓ Aucune erreur TypeScript');
} catch(e) { console.log(e.stdout?.toString()); }
"
```

---

## 4. Bug d'authentification

### Symptômes
- Redirigé vers `/login` sans raison
- `coachId` est null alors que connecté
- Un joueur voit les données d'un autre

### Fichiers concernés
- `app/coach/page.tsx` → `useEffect` du auth check (ligne ~24)
- `app/api/joueurs/check-access/route.ts` → contrôle d'accès joueur
- `lib/supabase.ts` → client (utilise la `anon key`, jamais la `service_role key` côté client)

### À ne jamais faire
```js
// ❌ NE JAMAIS exposer la service_role key côté client
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)

// ✓ Côté client → anon key uniquement
const supabase = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

La `service_role key` n'est utilisée que dans `scripts/import-totalcoaching.mjs` et les routes API (`app/api/`).

---

## 5. Bug de migration DB (colonne manquante)

### Symptôme
```
Could not find column 'sets_config' in table 'seance_exercices'
```

### Solution
Aller dans **Supabase Dashboard → SQL Editor** et exécuter :
```sql
-- Colonnes ajoutées après le schéma initial
ALTER TABLE seance_exercices ADD COLUMN IF NOT EXISTS sets_config jsonb;
ALTER TABLE seance_exercices ADD COLUMN IF NOT EXISTS lien_suivant boolean DEFAULT false;
ALTER TABLE seance_exercices ADD COLUMN IF NOT EXISTS uni_podal boolean DEFAULT false;
ALTER TABLE seance_exercices ADD COLUMN IF NOT EXISTS recuperation_inter_sets integer;
ALTER TABLE seance_exercices ADD COLUMN IF NOT EXISTS recuperation_active boolean DEFAULT false;

ALTER TABLE joueurs ADD COLUMN IF NOT EXISTS acces_debut date;
ALTER TABLE joueurs ADD COLUMN IF NOT EXISTS acces_fin date;
ALTER TABLE joueurs ADD COLUMN IF NOT EXISTS auth_id uuid;
```

> `lib/schema.sql` est la référence de départ — il ne contient pas ces colonnes ajoutées après coup.

---

## 6. Bug de notifications push

### Fichiers concernés
- `lib/push.ts` → logique subscribe/send
- `app/api/push/subscribe/route.ts` → enregistrement
- `app/api/push/send/route.ts` → envoi
- `.env.local` → `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_MAILTO`

### Checklist
- [ ] Le joueur a-t-il accepté les notifications dans son navigateur ?
- [ ] Les clés VAPID sont-elles bien dans `.env.local` ?
- [ ] Le service worker `public/sw.js` existe-t-il ?

---

## 7. Modifier le design sans casser

### Règle
Toutes les classes visuelles sont dans `app/globals.css`.  
Les composants utilisent ces classes via `className="..."`.  
Les styles inline (`style={{ }}`) sont pour les valeurs dynamiques (couleur calculée, position variable).

### Ce qu'on peut changer librement dans globals.css
- Couleurs des variables `:root { --bleu: ... }`
- Effets hover (`.card:hover`, `.btn-primary:hover`)
- Animations (`@keyframes fadeUp`, durées)
- Rayons, espacements

### Ce qu'il ne faut pas toucher sans comprendre
- `transform: translateX(0) !important` sur `.sidebar` (desktop)
- `margin-left: 220px` sur `.main-content` (compense la sidebar fixe)
- `z-index` des overlays (modal: 300, bottom-sheet: 400, sidebar: 50)

---

## 8. Script d'import (TotalCoaching)

### Usage
```bash
node scripts/import-totalcoaching.mjs
```

### Si ça échoue
- **"sets_config column not found"** → migration manquante (voir §5)
- **"Permission denied"** → la `service_role key` dans le script est-elle à jour ?
- **Exercice dupliqué** → le script cherche d'abord par `.ilike('nom', ...)` → si le nom diffère légèrement, il en crée un nouveau

### Modifier le script pour une nouvelle séance
1. Copier un bloc `EXERCICES` existant
2. Ajouter `famille_id: FAM.xxx` (les IDs sont en haut du fichier dans `const FAM = {}`)
3. Changer `SESSION_NOM` en haut du fichier
4. Relancer `node scripts/import-totalcoaching.mjs`

---

## Checklist avant de déployer (Vercel)

- [ ] `node -e "..."` TypeScript → 0 erreurs
- [ ] Tester sur mobile (viewport 390px) et desktop (1440px)
- [ ] Vérifier que la sidebar apparaît bien sur desktop sans hamburger
- [ ] Vérifier les données en prod (Supabase) vs local
- [ ] Ne pas committer `.env.local`

```bash
# Push vers Vercel (déclenche auto le deploy)
git add app/ lib/ scripts/ public/
git commit -m "description du fix"
git push origin main
```
