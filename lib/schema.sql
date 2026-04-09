-- RESET
drop table if exists messages cascade;
drop table if exists groupes cascade;
drop table if exists realisations cascade;
drop table if exists seance_exercices cascade;
drop table if exists seances cascade;
drop table if exists joueur_programmes cascade;
drop table if exists programmes cascade;
drop table if exists joueurs cascade;
drop table if exists exercices cascade;
drop table if exists familles cascade;

-- FAMILLES D'EXERCICES
create table familles (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  couleur text not null,
  created_at timestamp with time zone default now()
);

insert into familles (nom, couleur) values
  ('Vitesse', '#FF6B35'),
  ('Force', '#C9A84C'),
  ('Puissance', '#FF4757'),
  ('Coordination', '#9B59B6'),
  ('Appuis', '#1A6FFF'),
  ('Mobilité', '#2ECC71'),
  ('Stretch', '#1ABC9C'),
  ('Accélération', '#F39C12'),
  ('Décélération', '#E74C3C'),
  ('Pliométrie', '#E91E63'),
  ('Technique de base', '#00BCD4'),
  ('Technique athlétique', '#3F51B5'),
  ('Prévention', '#27AE60'),
  ('COD', '#FF9800'),
  ('Cardio', '#F44336'),
  ('Proprioception', '#8BC34A');

-- EXERCICES
create table exercices (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  famille_id uuid references familles(id),
  description text,
  consignes_execution text,
  video_url text,
  materiel text,
  zone_musculaire text,
  type_effort text,
  position text,
  created_at timestamp with time zone default now()
);

-- JOUEURS
create table joueurs (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  prenom text not null,
  email text unique not null,
  mot_de_passe_temp text,
  age integer,
  poste text,
  niveau text,
  club text,
  historique_blessures text,
  actif boolean default true,
  created_at timestamp with time zone default now()
);

-- PROGRAMMES
create table programmes (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  description text,
  objectif text,
  created_at timestamp with time zone default now()
);

-- ASSIGNATION PROGRAMME → JOUEUR
create table joueur_programmes (
  id uuid default gen_random_uuid() primary key,
  joueur_id uuid references joueurs(id) on delete cascade,
  programme_id uuid references programmes(id) on delete cascade,
  date_debut date not null,
  date_fin date,
  actif boolean default true,
  created_at timestamp with time zone default now()
);

-- SÉANCES
create table seances (
  id uuid default gen_random_uuid() primary key,
  programme_id uuid references programmes(id) on delete cascade,
  nom text not null,
  type text check (type in ('echauffement', 'corps', 'retour_au_calme', 'complete')),
  jour_semaine integer check (jour_semaine between 1 and 7),
  semaine integer,
  notes text,
  est_template boolean default false,
  created_at timestamp with time zone default now()
);

-- EXERCICES DANS UNE SÉANCE
create table seance_exercices (
  id uuid default gen_random_uuid() primary key,
  seance_id uuid references seances(id) on delete cascade,
  exercice_id uuid references exercices(id),
  ordre integer not null,
  series integer,
  repetitions integer,
  duree_secondes integer,
  distance_metres integer,
  charge_kg decimal,
  recuperation_secondes integer,
  notes text,
  created_at timestamp with time zone default now()
);

-- RÉALISATIONS (joueur a fait une séance)
create table realisations (
  id uuid default gen_random_uuid() primary key,
  joueur_id uuid references joueurs(id),
  seance_id uuid references seances(id),
  date_realisation date not null,
  completee boolean default false,
  rpe integer check (rpe between 1 and 10),
  fatigue integer check (fatigue between 1 and 10),
  courbatures integer check (courbatures between 1 and 10),
  qualite_sommeil integer check (qualite_sommeil between 1 and 10),
  notes_joueur text,
  created_at timestamp with time zone default now()
);

-- MESSAGES
create table messages (
  id uuid default gen_random_uuid() primary key,
  expediteur_id uuid not null,
  destinataire_id uuid,
  groupe_id uuid,
  contenu text,
  media_url text,
  media_type text check (media_type in ('image', 'video', null)),
  lu boolean default false,
  created_at timestamp with time zone default now()
);

-- GROUPES DE MESSAGERIE
create table groupes (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  created_at timestamp with time zone default now()
);
Trap