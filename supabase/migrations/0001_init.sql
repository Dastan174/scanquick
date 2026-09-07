-- LoveQR initial schema.
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)
-- after creating the project. Safe to re-run: every statement is idempotent.

-- ==============================================================================
-- PROFILES (one row per auth.users, created automatically on sign-up)
-- ==============================================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'premium', 'gift')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on profiles;
create policy "Profiles are viewable by owner" on profiles for select using (auth.uid () = id);

drop policy if exists "Profiles are updatable by owner" on profiles;
create policy "Profiles are updatable by owner" on profiles for update using (auth.uid () = id);

-- Auto-create a profile row whenever a new user signs up.
create or replace function handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users for each row
execute function handle_new_user ();

-- ==============================================================================
-- PROJECTS (one love story per row)
-- ==============================================================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid (),
  owner_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  partner_a text not null,
  partner_b text not null,
  anniversary_date date,
  template_id text not null default 'starlit-romance',
  slug text unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  password_hash text,
  -- Template-specific slots that don't need their own columns/migrations:
  -- letter text, quotes[], chat messages, balloon messages, video urls, etc.
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on projects (owner_id);

create index if not exists projects_slug_idx on projects (slug);

alter table projects enable row level security;

drop policy if exists "Projects are manageable by owner" on projects;
create policy "Projects are manageable by owner" on projects for all using (auth.uid () = owner_id)
with
  check (auth.uid () = owner_id);

drop policy if exists "Published projects are publicly readable" on projects;
create policy "Published projects are publicly readable" on projects for select using (status = 'published');

create or replace function set_updated_at () returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;

create trigger projects_set_updated_at before
update on projects for each row
execute function set_updated_at ();

-- ==============================================================================
-- PROJECT MEDIA (photos/videos filling a template's slots)
-- ==============================================================================

create table if not exists project_media (
  id uuid primary key default gen_random_uuid (),
  project_id uuid not null references projects (id) on delete cascade,
  slot_key text not null, -- e.g. 'cover', 'gallery_1', 'video_1'
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_media_project_id_idx on project_media (project_id);

alter table project_media enable row level security;

drop policy if exists "Media is manageable by project owner" on project_media;
create policy "Media is manageable by project owner" on project_media for all using (
  exists (
    select 1
    from projects p
    where
      p.id = project_media.project_id
      and p.owner_id = auth.uid ()
  )
)
with
  check (
    exists (
      select 1
      from projects p
      where
        p.id = project_media.project_id
        and p.owner_id = auth.uid ()
    )
  );

drop policy if exists "Media of published projects is publicly readable" on project_media;
create policy "Media of published projects is publicly readable" on project_media for select using (
  exists (
    select 1
    from projects p
    where
      p.id = project_media.project_id
      and p.status = 'published'
  )
);

-- ==============================================================================
-- SCANS (QR analytics)
-- ==============================================================================

create table if not exists scans (
  id uuid primary key default gen_random_uuid (),
  project_id uuid not null references projects (id) on delete cascade,
  scanned_at timestamptz not null default now(),
  country text,
  device text
);

create index if not exists scans_project_id_idx on scans (project_id);

alter table scans enable row level security;

drop policy if exists "Anyone can log a scan" on scans;
create policy "Anyone can log a scan" on scans for insert
with
  check (true);

drop policy if exists "Owner can view scans" on scans;
create policy "Owner can view scans" on scans for select using (
  exists (
    select 1
    from projects p
    where
      p.id = scans.project_id
      and p.owner_id = auth.uid ()
  )
);

-- ==============================================================================
-- PAYMENTS (billing history)
-- ==============================================================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid (),
  profile_id uuid not null references profiles (id) on delete cascade,
  plan text not null,
  amount numeric(10, 2) not null,
  status text not null default 'success' check (status in ('success', 'refunded', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists payments_profile_id_idx on payments (profile_id);

alter table payments enable row level security;

drop policy if exists "Owner can view own payments" on payments;
create policy "Owner can view own payments" on payments for select using (auth.uid () = profile_id);

-- No insert/update policy for regular users: payments are only ever
-- written by the server via the service_role key (e.g. a payment webhook),
-- which bypasses RLS entirely.

-- ==============================================================================
-- GRANTS
-- ==============================================================================
-- RLS policies only filter *which rows* a role can see — the role still
-- needs this coarser GRANT to touch the table at all. Tables created via the
-- Supabase Table Editor get this automatically; tables created via raw SQL
-- (like this file) don't, so it's granted explicitly here.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.projects to anon, authenticated;
grant select, insert, update, delete on public.project_media to anon, authenticated;
grant select, insert, update, delete on public.scans to anon, authenticated;
grant select, insert, update, delete on public.payments to anon, authenticated;

-- ==============================================================================
-- STORAGE (project photos & videos)
-- ==============================================================================

insert into
  storage.buckets (id, name, public)
values
  ('project-media', 'project-media', true)
on conflict (id) do nothing;

drop policy if exists "Project media is publicly readable" on storage.objects;
create policy "Project media is publicly readable" on storage.objects for select using (bucket_id = 'project-media');

drop policy if exists "Authenticated users can upload project media" on storage.objects;
create policy "Authenticated users can upload project media" on storage.objects for insert
with
  check (
    bucket_id = 'project-media'
    and auth.uid () is not null
  );

drop policy if exists "Authenticated users can update their project media" on storage.objects;
create policy "Authenticated users can update their project media" on storage.objects for update using (
  bucket_id = 'project-media'
  and auth.uid () is not null
);

drop policy if exists "Authenticated users can delete their project media" on storage.objects;
create policy "Authenticated users can delete their project media" on storage.objects for delete using (
  bucket_id = 'project-media'
  and auth.uid () is not null
);

-- NOTE: the storage policies above only check that the uploader is signed
-- in, not that they own the specific project. Once uploads go through the
-- app, store files under `${owner_id}/${project_id}/...` and tighten these
-- to `(storage.foldername(name))[1] = auth.uid()::text` so users can only
-- touch their own folder.
