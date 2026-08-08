-- =========================================================================
-- FIX: Bentota Beach was seeded with a wrong image path
-- (missing the "stock2/" folder), causing a 404 / broken image.
-- Trincomalee Beach's path was already correct — re-asserted here too,
-- just in case, and to force a fresh row so Vercel/Next re-fetches it.
-- Run in Supabase SQL Editor.
-- =========================================================================

update destinations
set image = '/images/stock2/beach-villa-coast.jpg'
where slug = 'bentota-beach';

update destinations
set image = '/images/stock2/harbor-boats-misty.jpg'
where slug = 'trincomalee-beach';
