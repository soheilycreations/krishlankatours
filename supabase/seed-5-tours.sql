-- =========================================================================
-- 5 NEW TOURS — Deep Sea Fishing, Brief Garden, Lunuganga,
--               Kitulgala Rafting, Kosgoda Turtle Hatchery
-- Run in Supabase SQL Editor.
-- Prices are placeholders — set real prices in /admin/tours.
-- Placeholder photos from the site library — upload real tour photos
-- in the admin panel and they'll show in the new tour photo gallery.
-- =========================================================================

insert into tours (
  slug, category, duration_days, price_from_usd, group_size,
  hero_image, gallery, title_en, title_de, tagline_en, tagline_de,
  summary_en, summary_de, highlights, itinerary, sort_order
) values
(
  'bentota-deep-sea-fishing', 'coastal', 1, 60, 'Up to 4 hours · morning or evening session',
  '/images/stock3/aerial-coastal-boats.jpg',
  ARRAY['/images/stock3/aerial-coastal-boats.jpg', '/images/stock2/harbor-boats-misty.jpg', '/images/stock2/palm-point-coast.jpg']::text[],
  'Bentota Deep Sea Fishing Day Tour', 'Bentota Hochseeangeln-Tagestour',
  'Cast a line in some of the most bountiful waters of the Indian Ocean.',
  'Angeln Sie in einigen der fischreichsten Gewässer des Indischen Ozeans.',
  'Head out from Bentota Harbor with professional local fishermen for an unforgettable deep-sea fishing session in the Indian Ocean. Learn trolling techniques from the crew and try your luck with tuna, snapper, barracuda and other game fish. Choose the preferred early-morning session at 6:00 a.m. or an afternoon session at 2:30 p.m. — around four hours on the water, or longer on request. Best fishing season runs November to April. Boat charter, full sport-fishing equipment, an English-speaking guide, light refreshments and government tax are all included.',
  'Fahren Sie vom Hafen Bentota mit professionellen einheimischen Fischern zu einer unvergesslichen Hochseeangel-Session im Indischen Ozean hinaus. Lernen Sie Schlepptechniken von der Crew und versuchen Sie Ihr Glück bei Thunfisch, Schnapper, Barrakuda und anderen Sportfischen. Wählen Sie die bevorzugte Morgensession um 6:00 Uhr oder die Nachmittagssession um 14:30 Uhr — rund vier Stunden auf dem Wasser, auf Wunsch länger. Beste Saison: November bis April. Bootscharter, komplette Angelausrüstung, englischsprachiger Guide, leichte Erfrischungen und Steuern sind inklusive.',
  '[
    {"en":"Deep-sea fishing in the bountiful Indian Ocean","de":"Hochseeangeln im fischreichen Indischen Ozean"},
    {"en":"Tuna, snapper, barracuda & more game fish","de":"Thunfisch, Schnapper, Barrakuda & weitere Sportfische"},
    {"en":"Learn trolling from professional local fishermen","de":"Schlepptechniken von einheimischen Profis lernen"},
    {"en":"Boat, full equipment & refreshments included","de":"Boot, komplette Ausrüstung & Erfrischungen inklusive"},
    {"en":"Best season: November to April","de":"Beste Saison: November bis April"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Out on the ocean","de":"Hinaus aufs Meer"},"description":{"en":"Meet at Bentota Harbor — 6:00 a.m. for the preferred morning session or 2:30 p.m. for the evening run. Head into open water, learn the gear, troll for game fish with the crew, and return with your catch and plenty of stories after about four hours.","de":"Treffpunkt Hafen Bentota — 6:00 Uhr für die bevorzugte Morgensession oder 14:30 Uhr am Nachmittag. Hinaus aufs offene Meer, Einweisung in die Ausrüstung, Schleppangeln mit der Crew und Rückkehr mit Fang und vielen Geschichten nach rund vier Stunden."}}]'::jsonb,
  0
),
(
  'brief-garden-bawa', 'heritage', 1, 35, 'Half-day · combine with Lunuganga',
  '/images/palm-avenue-garden.jpg',
  ARRAY['/images/palm-avenue-garden.jpg', '/images/stock2/rattan-craft-shop.jpg', '/images/buddha-carving.jpg']::text[],
  'Brief Garden — the Bawa Family Estate', 'Brief Garden — das Anwesen der Familie Bawa',
  'Wander the enchanting garden created by Bevis Bawa, brother of architect Geoffrey Bawa.',
  'Spazieren Sie durch den zauberhaften Garten von Bevis Bawa, dem Bruder des Architekten Geoffrey Bawa.',
  'Hidden in the hills near Beruwala lies Brief Garden, the life''s work of Bevis Bawa — landscape artist and brother of Sri Lanka''s most celebrated architect, Geoffrey Bawa. Wander shaded stone pathways past moss-covered sculptures, tranquil ponds and secret garden rooms bursting with tropical greenery, then step inside the artist''s home with its eclectic artworks. A peaceful half-day escape full of art, history and birdsong — easily combined with Geoffrey Bawa''s Lunuganga estate for a full Bawa day.',
  'Versteckt in den Hügeln bei Beruwala liegt Brief Garden, das Lebenswerk von Bevis Bawa — Landschaftskünstler und Bruder von Sri Lankas berühmtestem Architekten Geoffrey Bawa. Spazieren Sie über schattige Steinpfade vorbei an moosbewachsenen Skulpturen, stillen Teichen und geheimen Gartenräumen voller tropischem Grün und besichtigen Sie das Haus des Künstlers mit seinen vielfältigen Kunstwerken. Ein friedlicher Halbtagesausflug voller Kunst, Geschichte und Vogelgezwitscher — ideal kombinierbar mit Geoffrey Bawas Anwesen Lunuganga.',
  '[
    {"en":"The Bawa family''s famous landscape garden","de":"Der berühmte Landschaftsgarten der Familie Bawa"},
    {"en":"Moss-covered sculptures & secret garden rooms","de":"Moosbewachsene Skulpturen & geheime Gartenräume"},
    {"en":"Visit the artist''s house and its artworks","de":"Besuch des Künstlerhauses mit seinen Kunstwerken"},
    {"en":"Peaceful, shaded walk — great in any season","de":"Friedlicher, schattiger Spaziergang — zu jeder Jahreszeit"},
    {"en":"Combine with Lunuganga for a full Bawa day","de":"Mit Lunuganga zu einem ganzen Bawa-Tag kombinierbar"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Garden wander","de":"Gartenspaziergang"},"description":{"en":"Hotel pickup, scenic drive inland to Brief Garden, a guided wander through the garden rooms and the house, time for photos and a cool drink, then return — or continue on to Lunuganga.","de":"Abholung am Hotel, malerische Fahrt ins Landesinnere zum Brief Garden, geführter Spaziergang durch die Gartenräume und das Haus, Zeit für Fotos und ein kühles Getränk, dann Rückfahrt — oder weiter nach Lunuganga."}}]'::jsonb,
  0
),
(
  'lunuganga-estate-tour', 'heritage', 1, 40, 'Half-day · guided estate visit',
  '/images/stock2/small-island-lagoon.jpg',
  ARRAY['/images/stock2/small-island-lagoon.jpg', '/images/stock2/nuwaraeliya-lake-aerial.jpg', '/images/palm-avenue-garden.jpg']::text[],
  'Bentota Lunuganga Estate Tour', 'Bentota Lunuganga-Anwesen-Tour',
  'Discover Geoffrey Bawa''s renowned country estate — gardens, lake views and timeless architecture.',
  'Entdecken Sie Geoffrey Bawas berühmtes Landgut — Gärten, Seeblicke und zeitlose Architektur.',
  'Lunuganga was the beloved country home of Geoffrey Bawa, the father of tropical modernist architecture, and he shaped its gardens for over forty years. Explore beautiful terraced gardens rolling down to Dedduwa Lake, gorgeous architecture framed by ancient trees, and breathtaking scenery at every turn of the path. A guided walk reveals the stories behind the sculptures, vistas and garden follies of Sri Lanka''s most influential creative mind. An unmissable half-day for lovers of design, gardens and quiet beauty.',
  'Lunuganga war das geliebte Landhaus von Geoffrey Bawa, dem Vater der tropischen Moderne, dessen Gärten er über vierzig Jahre lang gestaltete. Erkunden Sie wunderschöne Gartenterrassen, die zum Dedduwa-See hinabfließen, herrliche Architektur zwischen alten Bäumen und atemberaubende Ausblicke an jeder Wegbiegung. Ein geführter Rundgang erzählt die Geschichten hinter den Skulpturen, Sichtachsen und Gartenpavillons von Sri Lankas einflussreichstem Gestalter. Ein Muss für Liebhaber von Design, Gärten und stiller Schönheit.',
  '[
    {"en":"Geoffrey Bawa''s renowned country estate","de":"Geoffrey Bawas berühmtes Landgut"},
    {"en":"Beautiful terraced gardens","de":"Wunderschöne Gartenterrassen"},
    {"en":"Stunning Dedduwa Lake views","de":"Herrliche Blicke auf den Dedduwa-See"},
    {"en":"Gorgeous tropical-modernist architecture","de":"Herrliche tropisch-moderne Architektur"},
    {"en":"Breathtaking scenery on a guided walk","de":"Atemberaubende Kulisse auf einem geführten Rundgang"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"The Bawa estate","de":"Das Bawa-Anwesen"},"description":{"en":"Hotel pickup, short drive to Lunuganga near Bentota, guided walk through the terraces, gardens and lakefront vistas, free time for photos, then return to your hotel.","de":"Abholung am Hotel, kurze Fahrt nach Lunuganga bei Bentota, geführter Rundgang durch Terrassen, Gärten und Seepanoramen, freie Zeit für Fotos, dann Rückfahrt zum Hotel."}}]'::jsonb,
  0
),
(
  'kitulgala-white-water-rafting', 'hillcountry', 1, 65, 'Adventure groups & active couples',
  '/images/stock2/mountain-road-teacountry.jpg',
  ARRAY['/images/stock2/mountain-road-teacountry.jpg', '/images/stock2/hillcountry-misty-dusk.jpg', '/images/river-boat-safari.jpg']::text[],
  'Kitulgala White Water Rafting', 'Kitulgala Wildwasser-Rafting',
  'Ride the thrilling rapids of the Kelani River through lush rainforest scenery.',
  'Bezwingen Sie die aufregenden Stromschnellen des Kelani-Flusses inmitten üppigen Regenwalds.',
  'Kitulgala is Sri Lanka''s white-water capital, and its stretch of the Kelani River serves up an unforgettable ride. With professional rafting guides and full safety equipment you''ll paddle through a series of exciting rapids framed by tropical rainforest, with calm pools in between for a swim. No experience needed — a full safety briefing is included, making this a perfect adrenaline day for adventure groups and active couples. A private day trip with comfortable transport from your hotel.',
  'Kitulgala ist Sri Lankas Wildwasser-Hauptstadt, und dieser Abschnitt des Kelani-Flusses bietet ein unvergessliches Erlebnis. Mit professionellen Rafting-Guides und kompletter Sicherheitsausrüstung paddeln Sie durch aufregende Stromschnellen inmitten des tropischen Regenwaldes, mit ruhigen Abschnitten zum Schwimmen dazwischen. Keine Erfahrung nötig — ein ausführliches Sicherheitsbriefing ist inklusive. Der perfekte Adrenalintag für Abenteuergruppen und aktive Paare, als privater Tagesausflug mit bequemem Transport ab Hotel.',
  '[
    {"en":"Thrilling rapids on the Kelani River","de":"Aufregende Stromschnellen auf dem Kelani-Fluss"},
    {"en":"Professional guides & full safety gear","de":"Professionelle Guides & komplette Sicherheitsausrüstung"},
    {"en":"Tropical rainforest scenery all around","de":"Tropische Regenwaldkulisse rundum"},
    {"en":"Calm pools for swimming between rapids","de":"Ruhige Abschnitte zum Schwimmen zwischen den Stromschnellen"},
    {"en":"No experience needed — beginners welcome","de":"Keine Erfahrung nötig — Anfänger willkommen"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Rapids day","de":"Stromschnellen-Tag"},"description":{"en":"Early hotel pickup, scenic drive into the hills to Kitulgala, safety briefing and gear-up, white-water rafting session with swim stops, riverside lunch, and return to your hotel by evening.","de":"Frühe Abholung am Hotel, malerische Fahrt in die Berge nach Kitulgala, Sicherheitsbriefing und Ausrüstung, Wildwasser-Rafting mit Badestopps, Mittagessen am Fluss und Rückkehr zum Hotel am Abend."}}]'::jsonb,
  0
),
(
  'kosgoda-turtle-hatchery', 'wildlife', 1, 25, 'Families, children & nature lovers',
  '/images/real/turtle-release-beach.jpg',
  ARRAY['/images/real/turtle-release-beach.jpg', '/images/real/river-safari-boat-guests.jpg', '/images/stock2/palm-point-coast.jpg']::text[],
  'Kosgoda Turtle Hatchery Visit', 'Besuch der Schildkröten-Aufzuchtstation Kosgoda',
  'Meet Sri Lanka''s sea turtles and the people working to protect them — minutes from Ahungalla.',
  'Begegnen Sie Sri Lankas Meeresschildkröten und den Menschen, die sie schützen — nur Minuten von Ahungalla.',
  'Just a short drive from Ahungalla, the famous Kosgoda turtle hatchery has been protecting sea turtles along Sri Lanka''s southern coast for decades. See rescued turtles up close, learn about the life cycle of these ancient mariners, and discover how conservation centres protect eggs and release hatchlings safely into the ocean. A short, easy and genuinely heart-warming visit that''s perfect for children and adults alike — and easily combined with the Madu River boat safari, Bentota, Hikkaduwa or Galle Fort for a longer day out.',
  'Nur eine kurze Fahrt von Ahungalla entfernt schützt die berühmte Aufzuchtstation Kosgoda seit Jahrzehnten die Meeresschildkröten an Sri Lankas Südküste. Erleben Sie gerettete Schildkröten aus nächster Nähe, lernen Sie den Lebenszyklus dieser uralten Meeresbewohner kennen und erfahren Sie, wie die Station Eier schützt und Jungtiere sicher ins Meer entlässt. Ein kurzer, unkomplizierter und wirklich herzerwärmender Besuch für Kinder wie Erwachsene — leicht kombinierbar mit der Madu-Fluss-Bootssafari, Bentota, Hikkaduwa oder dem Galle Fort für einen längeren Ausflug.',
  '[
    {"en":"Famous Kosgoda sea turtle hatchery","de":"Berühmte Meeresschildkröten-Station Kosgoda"},
    {"en":"See rescued turtles & tiny hatchlings up close","de":"Gerettete Schildkröten & winzige Jungtiere hautnah"},
    {"en":"Learn how conservation protects eggs & hatchlings","de":"Erfahren, wie Artenschutz Eier & Jungtiere schützt"},
    {"en":"Short & easy — minutes from Ahungalla","de":"Kurz & unkompliziert — Minuten von Ahungalla"},
    {"en":"Combine with Madu River, Bentota or Galle Fort","de":"Kombinierbar mit Madu-Fluss, Bentota oder Galle Fort"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Turtle time","de":"Schildkröten-Zeit"},"description":{"en":"Hotel pickup, short private drive to Kosgoda, guided hatchery visit with the conservation team, optional hatchling-release experience depending on season, then back — or continue to the Madu River, Bentota or Galle Fort.","de":"Abholung am Hotel, kurze private Fahrt nach Kosgoda, geführter Besuch der Station mit dem Naturschutzteam, je nach Saison optionale Freilassung von Jungtieren, dann zurück — oder weiter zum Madu-Fluss, nach Bentota oder zum Galle Fort."}}]'::jsonb,
  0
)
on conflict (slug) do nothing;
