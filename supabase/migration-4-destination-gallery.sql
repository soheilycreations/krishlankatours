-- Adds a photo gallery (multiple images) to destinations, in addition to
-- the single card image. Run in the Supabase SQL Editor.
alter table destinations add column if not exists gallery text[] default '{}';
