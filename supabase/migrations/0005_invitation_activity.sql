-- The recipient now also picks an activity (walk / eat / movie / etc.)
-- before the date/time step. Run this once in the Supabase SQL Editor.

alter table invitation_responses
add column if not exists activity text;
