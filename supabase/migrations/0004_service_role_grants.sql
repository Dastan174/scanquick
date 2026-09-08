-- The `service_role` key is meant to bypass RLS entirely (used by the
-- Telegram webhook, see src/shared/lib/supabase/admin.ts), but it was never
-- actually GRANTed access to these tables — only anon/authenticated got
-- that in 0001_init.sql. Without this, every service-role query fails with
-- "permission denied for table ..." even though the key itself is valid.
-- Run this once in the Supabase SQL Editor.

grant usage on schema public to service_role;

grant select, insert, update, delete on all tables in schema public to service_role;

-- So this also covers any table added after this migration runs.
alter default privileges in schema public
grant select, insert, update, delete on tables to service_role;
