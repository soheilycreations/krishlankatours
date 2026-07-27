-- =========================================================================
-- REAL TRIPADVISOR REVIEWS SEED (condensed — edit/expand in /admin/reviews)
-- Full originals: tripadvisor.com listing d34220717. You can paste the
-- complete review texts from your TripAdvisor page in the admin panel.
-- =========================================================================
insert into reviews (author, country, rating, text_en, review_date, source, sort_order) values
  ('Udesh K', 'Sri Lanka', 5, 'Excellent Bentota tour — well-organized itinerary, a beautiful river boat safari, exciting water sports, and a professional, friendly team throughout. Highly recommended!', '2026-07-06', 'tripadvisor', 1),
  ('Snowy', 'United Kingdom', 5, 'Krish met us at our hotel and arranged a wonderful river boat tour — monkeys, crocodiles, lizards and birds. He delivered exactly what was promised.', '2026-03-28', 'tripadvisor', 2),
  ('HindlesWorld', 'United Kingdom', 5, 'Krish was invaluable during our stay — great local connections across restaurants and tours, and fair local prices. Well worth contacting!', '2026-04-01', 'tripadvisor', 3),
  ('Mark S', 'United Kingdom', 5, 'A great tour experience with my family — we really appreciated the friendly kindness of Krish Lanka Tours.', '2026-04-01', 'tripadvisor', 4),
  ('Miyuru D', 'Sri Lanka', 5, 'Krish Lanka Tours — very safe and wonderful.', '2026-04-01', 'tripadvisor', 5),
  ('Deo B', 'Sri Lanka', 5, 'Excellent service and very safe. We recommend Krish Lanka Tours.', '2026-03-11', 'tripadvisor', 6)
on conflict do nothing;
