# Graph Report - .  (2026-04-28)

## Corpus Check
- 48 files · ~61,950 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 201 nodes · 225 edges · 33 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]

## God Nodes (most connected - your core abstractions)
1. `toast()` - 11 edges
2. `patchExoLocal()` - 9 edges
3. `String()` - 8 edges
4. `saveExoField()` - 7 edges
5. `GET()` - 7 edges
6. `loadData()` - 6 edges
7. `POST()` - 5 edges
8. `handleCopier()` - 4 edges
9. `deleteSeance()` - 4 edges
10. `loadJoueurs()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `fmtChrono()` --calls--> `String()`  [INFERRED]
  app/joueur/page.tsx → /Users/nicolasjover/Desktop/pagacoaching-app-perso/app/coach/components/GenerateurSeance.tsx
- `GET()` --calls--> `isCacheStale()`  [INFERRED]
  app/api/coach-id/route.ts → /Users/nicolasjover/Desktop/pagacoaching-app-perso/public/sw.js
- `send()` --calls--> `sendPush()`  [INFERRED]
  app/joueur/page.tsx → lib/push.ts
- `send()` --calls--> `sendPush()`  [INFERRED]
  app/coach/components/ChatView.tsx → lib/push.ts
- `confirmer()` --calls--> `toast()`  [INFERRED]
  /Users/nicolasjover/Desktop/pagacoaching-app-perso/app/coach/components/Modeles.tsx → /Users/nicolasjover/Desktop/pagacoaching-app-perso/app/coach/lib/toast.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (17): addSet(), async(), flushSets(), flushSimple(), mpAttribuerSessionId(), mpCopyExoToTargets(), mpDupSession(), mpMoveSession() (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (16): confirmer(), datesPrevues(), daysBetween(), handleCopier(), confirmer(), handleSave(), String(), mpDeleteRealisation() (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (5): goOnline(), hapticJ(), load(), reset(), uploadMedia()

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (6): getSessionUser(), requireAuth(), requireCoach(), GET(), POST(), isCacheStale()

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (1): confirmer()

### Community 5 - "Community 5"
Cohesion: 0.2
Nodes (7): load(), send(), uploadMedia(), send(), sendPush(), subscribePush(), urlBase64ToUint8Array()

### Community 6 - "Community 6"
Cohesion: 0.36
Nodes (6): createGroupe(), deleteGroupe(), handleSave(), loadGroupes(), loadJoueurs(), toggleActif()

### Community 7 - "Community 7"
Cohesion: 0.36
Nodes (5): deleteSeance(), editSeance(), getExercices(), loadList(), nouvelleSeance()

### Community 8 - "Community 8"
Cohesion: 0.38
Nodes (5): genererSeance(), pick(), seanceToText(), copier(), generer()

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (2): parseCSV(), splitCSVLine()

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 0.4
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 17`** (2 nodes): `loadData()`, `Dashboard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `Exercices()`, `Exercices.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `getDerivedStateFromError()`, `ErrorBoundary.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `page.tsx`, `handleLogin()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `sentry.server.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `sentry.client.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `sentry.edge.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `SplashScreen.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (1 nodes): `VideoThumb.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (1 nodes): `SearchableSelect.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (1 nodes): `types.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (1 nodes): `supabase.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `String()` connect `Community 1` to `Community 8`, `Community 7`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `toast()` connect `Community 1` to `Community 4`, `Community 6`, `Community 7`?**
  _High betweenness centrality (0.191) - this node is a cross-community bridge._
- **Why does `mpDeleteRealisation()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `toast()` (e.g. with `handleSave()` and `handleCopier()`) actually correct?**
  _`toast()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `String()` (e.g. with `fmtChrono()` and `handleCopier()`) actually correct?**
  _`String()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `GET()` (e.g. with `requireAuth()` and `requireCoach()`) actually correct?**
  _`GET()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._