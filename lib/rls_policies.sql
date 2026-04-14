-- ============================================================
-- RLS POLICIES — À exécuter dans Supabase SQL Editor
-- ============================================================
-- IMPORTANT : Ce fichier suppose que le coach est connecté via
-- Supabase Auth (session.user.id) et que les joueurs ont un
-- compte auth séparé lié à joueurs.email.
-- Pour l'instant : accès authentifié requis sur tout, et les
-- messages sont restreints à l'expéditeur/destinataire.
-- ============================================================

-- 1. Activer RLS sur toutes les tables
alter table familles          enable row level security;
alter table exercices         enable row level security;
alter table joueurs           enable row level security;
alter table programmes        enable row level security;
alter table joueur_programmes enable row level security;
alter table seances           enable row level security;
alter table seance_exercices  enable row level security;
alter table realisations      enable row level security;
alter table messages          enable row level security;
alter table groupes           enable row level security;

-- 2. FAMILLES — lecture publique authentifiée, écriture authentifiée
create policy "familles_read"   on familles for select using (auth.role() = 'authenticated');
create policy "familles_insert" on familles for insert with check (auth.role() = 'authenticated');
create policy "familles_update" on familles for update using (auth.role() = 'authenticated');
create policy "familles_delete" on familles for delete using (auth.role() = 'authenticated');

-- 3. EXERCICES — même logique
create policy "exercices_read"   on exercices for select using (auth.role() = 'authenticated');
create policy "exercices_insert" on exercices for insert with check (auth.role() = 'authenticated');
create policy "exercices_update" on exercices for update using (auth.role() = 'authenticated');
create policy "exercices_delete" on exercices for delete using (auth.role() = 'authenticated');

-- 4. JOUEURS
create policy "joueurs_read"   on joueurs for select using (auth.role() = 'authenticated');
create policy "joueurs_insert" on joueurs for insert with check (auth.role() = 'authenticated');
create policy "joueurs_update" on joueurs for update using (auth.role() = 'authenticated');
create policy "joueurs_delete" on joueurs for delete using (auth.role() = 'authenticated');

-- 5. PROGRAMMES
create policy "programmes_read"   on programmes for select using (auth.role() = 'authenticated');
create policy "programmes_insert" on programmes for insert with check (auth.role() = 'authenticated');
create policy "programmes_update" on programmes for update using (auth.role() = 'authenticated');
create policy "programmes_delete" on programmes for delete using (auth.role() = 'authenticated');

-- 6. JOUEUR_PROGRAMMES
create policy "jp_read"   on joueur_programmes for select using (auth.role() = 'authenticated');
create policy "jp_insert" on joueur_programmes for insert with check (auth.role() = 'authenticated');
create policy "jp_update" on joueur_programmes for update using (auth.role() = 'authenticated');
create policy "jp_delete" on joueur_programmes for delete using (auth.role() = 'authenticated');

-- 7. SEANCES
create policy "seances_read"   on seances for select using (auth.role() = 'authenticated');
create policy "seances_insert" on seances for insert with check (auth.role() = 'authenticated');
create policy "seances_update" on seances for update using (auth.role() = 'authenticated');
create policy "seances_delete" on seances for delete using (auth.role() = 'authenticated');

-- 8. SEANCE_EXERCICES
create policy "se_read"   on seance_exercices for select using (auth.role() = 'authenticated');
create policy "se_insert" on seance_exercices for insert with check (auth.role() = 'authenticated');
create policy "se_update" on seance_exercices for update using (auth.role() = 'authenticated');
create policy "se_delete" on seance_exercices for delete using (auth.role() = 'authenticated');

-- 9. REALISATIONS — lecture/écriture pour le joueur concerné + coach
create policy "realisations_read"   on realisations for select using (auth.role() = 'authenticated');
create policy "realisations_insert" on realisations for insert with check (auth.role() = 'authenticated');
create policy "realisations_update" on realisations for update using (auth.role() = 'authenticated');
create policy "realisations_delete" on realisations for delete using (auth.role() = 'authenticated');

-- 10. MESSAGES — strict : on ne voit que ses propres messages
create policy "messages_read" on messages for select
  using (
    auth.uid() = expediteur_id
    or auth.uid() = destinataire_id
  );
create policy "messages_insert" on messages for insert
  with check (auth.uid() = expediteur_id);
create policy "messages_update" on messages for update
  using (auth.uid() = destinataire_id);  -- seul le destinataire peut marquer "lu"
create policy "messages_delete" on messages for delete
  using (auth.uid() = expediteur_id);

-- 11. GROUPES
create policy "groupes_read"   on groupes for select using (auth.role() = 'authenticated');
create policy "groupes_insert" on groupes for insert with check (auth.role() = 'authenticated');
create policy "groupes_update" on groupes for update using (auth.role() = 'authenticated');
create policy "groupes_delete" on groupes for delete using (auth.role() = 'authenticated');

-- ============================================================
-- NOTE : Pour aller plus loin (multi-coach), il faudrait :
--   1. Ajouter une colonne coach_id uuid references auth.users(id)
--      sur les tables joueurs, programmes, seances, exercices
--   2. Remplacer "auth.role() = 'authenticated'" par
--      "auth.uid() = coach_id" dans les policies ci-dessus
-- ============================================================
