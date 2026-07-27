-- =========================================================================
-- AHUNGALLA VILLAGE TOUR BY TUK-TUK — from the promo flyer
-- Run in Supabase SQL Editor. Appears under the new "Village Tours" category.
-- =========================================================================
insert into tours (
  slug, category, duration_days, price_from_usd, group_size,
  hero_image, gallery, title_en, title_de, tagline_en, tagline_de,
  summary_en, summary_de, highlights, itinerary, sort_order
) values (
  'ahungalla-village-tuktuk-tour', 'village', 1, 15, '1–3 people per tuk-tuk · about 2 hours',
  '/images/stock3/tuktuk-forest-road.jpg',
  ARRAY['/images/stock3/tuktuk-forest-road.jpg', '/images/village-tour-flyer.jpg', '/images/stock3/rice-paddy-aerial.jpg', '/images/real/turtle-release-beach.jpg']::text[],
  'Ahungalla Village Tour by Tuk-Tuk', 'Ahungalla Dorftour per Tuk-Tuk',
  'Two hours of real village life — temple, spice garden, cinnamon, rice paddies, moonstones and turtles.',
  'Zwei Stunden echtes Dorfleben — Tempel, Gewürzgarten, Zimt, Reisfelder, Mondsteine und Schildkröten.',
  'Hop in my tuk-tuk and see the Ahungalla that tourists usually drive straight past. In about two hours we wind through village lanes to a historic Buddhist temple, a herbal and spice garden, a working cinnamon factory, green rice paddies, and a natural moonstone mine — every one of them free to enter. We finish at the turtle farm by the sea (small entrance ticket). An unforgettable little Sri Lankan adventure for just $15.',
  'Steig in mein Tuk-Tuk und entdecke das Ahungalla, an dem Touristen sonst vorbeifahren. In rund zwei Stunden geht es durch Dorfgassen zu einem historischen buddhistischen Tempel, einem Kräuter- und Gewürzgarten, einer Zimtfabrik, grünen Reisfeldern und einer natürlichen Mondstein-Mine — überall freier Eintritt. Zum Abschluss besuchen wir die Schildkrötenfarm am Meer (kleines Eintrittsticket). Ein unvergessliches kleines Sri-Lanka-Abenteuer für nur 15 $.',
  '[
    {"en":"Historic Buddhist temple — free entry","de":"Historischer buddhistischer Tempel — freier Eintritt"},
    {"en":"Herbal & spice garden — free entry","de":"Kräuter- und Gewürzgarten — freier Eintritt"},
    {"en":"Working cinnamon factory — free entry","de":"Zimtfabrik in Betrieb — freier Eintritt"},
    {"en":"Rice plantation visit — free entry","de":"Besuch einer Reisplantage — freier Eintritt"},
    {"en":"Natural moonstone mine — free entry","de":"Natürliche Mondstein-Mine — freier Eintritt"},
    {"en":"Turtle farm finale by the sea (entrance ticket)","de":"Schildkrötenfarm am Meer zum Abschluss (Eintrittsticket)"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Two hours through the village","de":"Zwei Stunden durchs Dorf"},"description":{"en":"Pickup from your Ahungalla hotel by tuk-tuk, then temple, spice garden, cinnamon factory, rice paddies, moonstone mine, and the turtle farm to finish. Back at your hotel in about two hours.","de":"Abholung per Tuk-Tuk von Ihrem Hotel in Ahungalla, dann Tempel, Gewürzgarten, Zimtfabrik, Reisfelder, Mondstein-Mine und zum Abschluss die Schildkrötenfarm. Nach etwa zwei Stunden zurück im Hotel."}}]'::jsonb,
  0
)
on conflict (slug) do nothing;
