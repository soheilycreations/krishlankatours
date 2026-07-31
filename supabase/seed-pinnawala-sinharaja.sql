-- =========================================================================
-- PINNAWALA ELEPHANT ORPHANAGE + SINHARAJA RAINFOREST TOURS
-- Run in Supabase SQL Editor.
-- Prices are placeholders — set your real prices in /admin/tours.
-- Hero/gallery images are from the current site library — replace with
-- your own photos anytime from the admin panel.
-- =========================================================================

insert into tours (
  slug, category, duration_days, price_from_usd, group_size,
  hero_image, gallery, title_en, title_de, tagline_en, tagline_de,
  summary_en, summary_de, highlights, itinerary, sort_order
) values
(
  'pinnawala-elephant-orphanage-tour', 'wildlife', 1, 45, 'Perfect for families & kids',
  '/images/elephants-trio.jpg',
  ARRAY['/images/elephants-trio.jpg', '/images/golden-temple-hills.jpg']::text[],
  'Pinnawala Elephant Orphanage Tour', 'Pinnawala Elefantenwaisenhaus-Tour',
  'Meet the largest captive elephant herd in the world — a memorable Sri Lankan experience.',
  'Die größte Elefantenherde in menschlicher Obhut weltweit — ein unvergessliches Sri-Lanka-Erlebnis.',
  'Visit the world-famous Pinnawala Elephant Orphanage and experience the joy of seeing and learning about these gentle giants up close. Watch the herd bathe in the river, see the little ones being fed, and support ethical, sustainable tourism while making unforgettable memories. A comfortable private day trip with hotel pickup — perfect for families and kids.',
  'Besuchen Sie das weltberühmte Elefantenwaisenhaus Pinnawala und erleben Sie diese sanften Riesen aus nächster Nähe. Beobachten Sie die Herde beim Baden im Fluss, sehen Sie die Fütterung der Jungtiere und unterstützen Sie ethischen, nachhaltigen Tourismus. Ein bequemer privater Tagesausflug mit Hotelabholung — perfekt für Familien und Kinder.',
  '[
    {"en":"See & feed majestic elephants up close","de":"Majestätische Elefanten hautnah sehen & füttern"},
    {"en":"River bathing time — the herd in the water","de":"Badezeit am Fluss — die Herde im Wasser"},
    {"en":"Largest captive elephant herd in the world","de":"Die größte Elefantenherde in menschlicher Obhut"},
    {"en":"Perfect for families & kids","de":"Perfekt für Familien & Kinder"},
    {"en":"Supports ethical & sustainable tourism","de":"Unterstützt ethischen & nachhaltigen Tourismus"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Pinnawala day trip","de":"Tagesausflug nach Pinnawala"},"description":{"en":"Hotel pickup in the morning, scenic drive to Pinnawala, elephant feeding and river bathing sessions, free time for photos and lunch, then a relaxed drive back to your hotel.","de":"Abholung am Hotel am Morgen, malerische Fahrt nach Pinnawala, Fütterung und Flussbad der Elefanten, freie Zeit für Fotos und Mittagessen, dann entspannte Rückfahrt zum Hotel."}}]'::jsonb,
  0
),
(
  'sinharaja-rainforest-tour', 'wildlife', 1, 55, 'Small groups · guided trek',
  '/images/stock2/hillcountry-misty-dusk.jpg',
  ARRAY['/images/stock2/hillcountry-misty-dusk.jpg', '/images/stock3/tuktuk-forest-road.jpg', '/images/stock2/mountain-road-teacountry.jpg']::text[],
  'Sinharaja Rainforest Tour', 'Sinharaja-Regenwald-Tour',
  'Discover the natural heritage of Sri Lanka — a UNESCO World Heritage rainforest trek.',
  'Entdecken Sie das Naturerbe Sri Lankas — eine Trekkingtour im UNESCO-Weltnaturerbe-Regenwald.',
  'Explore Sinharaja, a UNESCO World Heritage Site and one of the world''s richest rainforests. On a guided nature walk through lush jungle trails you''ll discover hidden waterfalls, endemic birds and wildlife found nowhere else on Earth, and stunning untouched landscapes. Unforgettable nature experiences await — with professional guides and safe, comfortable transport from your hotel.',
  'Erkunden Sie Sinharaja, ein UNESCO-Weltnaturerbe und einer der artenreichsten Regenwälder der Welt. Auf einer geführten Naturwanderung über üppige Dschungelpfade entdecken Sie versteckte Wasserfälle, endemische Vögel und Tiere, die es nur hier gibt, sowie unberührte Landschaften. Unvergessliche Naturerlebnisse erwarten Sie — mit professionellen Guides und sicherem, komfortablem Transport ab Hotel.',
  '[
    {"en":"UNESCO World Heritage rainforest","de":"UNESCO-Weltnaturerbe-Regenwald"},
    {"en":"Guided trekking through lush jungle trails","de":"Geführtes Trekking über üppige Dschungelpfade"},
    {"en":"One of the world''s richest biodiversity hotspots","de":"Einer der artenreichsten Biodiversitäts-Hotspots der Welt"},
    {"en":"Hidden waterfalls & endemic wildlife","de":"Versteckte Wasserfälle & endemische Tierwelt"},
    {"en":"Professional guides, safe & comfortable tour","de":"Professionelle Guides, sichere & komfortable Tour"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Rainforest trek","de":"Regenwald-Trekking"},"description":{"en":"Early hotel pickup, drive to the Sinharaja entrance, guided nature walk with a local expert spotting endemic birds, waterfalls and wildlife, picnic-style lunch in nature, and return to your hotel by evening.","de":"Frühe Abholung am Hotel, Fahrt zum Sinharaja-Eingang, geführte Naturwanderung mit lokalem Experten zu endemischen Vögeln, Wasserfällen und Wildtieren, Picknick-Mittagessen in der Natur und Rückkehr zum Hotel am Abend."}}]'::jsonb,
  0
)
on conflict (slug) do nothing;
