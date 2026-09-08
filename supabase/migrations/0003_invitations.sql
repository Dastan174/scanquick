-- Date-invitation site type: a project can now be a 'love_story' (existing)
-- or an 'invitation' (new) — a Yes/No + date/time RSVP flow that notifies
-- the creator on Telegram when the recipient responds.
-- Run this once in the Supabase SQL Editor. Safe to re-run.

alter table projects
add column if not exists type text not null default 'love_story' check (type in ('love_story', 'invitation'));

-- Set once the owner links their Telegram via the bot's deep link
-- (t.me/<bot>?start=<telegram_link_token>) — the webhook resolves the
-- token back to this project and fills in the chat id to message.
alter table projects
add column if not exists telegram_chat_id text;

alter table projects
add column if not exists telegram_link_token uuid not null default gen_random_uuid ();

-- ==============================================================================
-- INVITATION RESPONSES (the recipient's date/time RSVP)
-- ==============================================================================

create table if not exists invitation_responses (
  id uuid primary key default gen_random_uuid (),
  project_id uuid not null references projects (id) on delete cascade,
  chosen_date date not null,
  chosen_time text not null,
  responded_at timestamptz not null default now()
);

create index if not exists invitation_responses_project_id_idx on invitation_responses (project_id);

alter table invitation_responses enable row level security;

-- Same shape as the `scans` table: the recipient is never signed in, so
-- anyone can insert a response, but only the project owner can read them.
drop policy if exists "Anyone can submit an invitation response" on invitation_responses;
create policy "Anyone can submit an invitation response" on invitation_responses for insert
with
  check (true);

drop policy if exists "Owner can view invitation responses" on invitation_responses;
create policy "Owner can view invitation responses" on invitation_responses for select using (
  exists (
    select 1
    from projects p
    where
      p.id = invitation_responses.project_id
      and p.owner_id = auth.uid ()
  )
);

grant select, insert, update, delete on public.invitation_responses to anon, authenticated;
