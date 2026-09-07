-- Fixes "permission denied for table X" (Postgres error 42501).
--
-- RLS policies only filter *which rows* a role can see — the role still
-- needs the coarse-grained GRANT to touch the table at all. Tables created
-- via the Supabase Table Editor get this automatically; tables created via
-- raw SQL (like our 0001_init.sql) don't, so we grant it explicitly here.
-- Run this once in the SQL Editor after 0001_init.sql.

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.projects to anon, authenticated;
grant select, insert, update, delete on public.project_media to anon, authenticated;
grant select, insert, update, delete on public.scans to anon, authenticated;
grant select, insert, update, delete on public.payments to anon, authenticated;
