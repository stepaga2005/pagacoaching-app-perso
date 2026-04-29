-- ACTIVITÉS
create table if not exists activites (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid not null,
  nom text not null,
  created_at timestamp with time zone default now()
);

-- Lien optionnel vers une activité dans les réalisations
alter table realisations
  add column if not exists activite_id uuid references activites(id);
