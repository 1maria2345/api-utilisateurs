-- Schéma de la base de données
-- À exécuter une fois dans Supabase : SQL Editor → New query → coller ce script → Run

-- Table des utilisateurs
create table public.users (
  id    bigint generated always as identity primary key,  -- généré par la base, jamais réutilisé
  nom   text    not null check (length(trim(nom)) > 0),     -- obligatoire, pas vide
  age   integer not null check (age >= 0),                  -- obligatoire, entier positif ou nul
  ville text    not null check (length(trim(ville)) > 0)    -- obligatoire, pas vide
);

-- Sécurité : la table n'est accessible qu'avec la clé service_role (celle du serveur)
alter table public.users enable row level security;

-- Données de départ
insert into public.users (nom, age, ville) values
  ('Alice', 28, 'Paris'),
  ('Karim', 35, 'Lyon'),
  ('Sofia', 22, 'Marseille');
