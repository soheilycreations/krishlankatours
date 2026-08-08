-- =========================================================================
-- 5 NEW DESTINATIONS — Sigiriya, Trincomalee, Mirissa, Galle Fort, Bentota
-- Run in Supabase SQL Editor. Photos are placeholders from the site
-- library — swap for real photos anytime in /admin/destinations.
-- =========================================================================
insert into destinations (
  slug, name_en, name_de, region_en, region_de, tagline_en, tagline_de,
  image, description, highlights, best_time_en, best_time_de, related_tour_slug, sort_order
) values
(
  'sigiriya-lion-rock', 'Sigiriya Lion Rock', 'Sigiriya Löwenfelsen',
  'Cultural Triangle', 'Kulturdreieck',
  'The ancient rock fortress rising from the jungle — one of Sri Lanka''s eight UNESCO World Heritage Sites.',
  'Die antike Felsenfestung, die aus dem Dschungel aufragt — eine von Sri Lankas acht UNESCO-Welterbestätten.',
  '/images/stock3/sigiriya-landscape-view.jpg',
  '[{"en":"Sigiriya is one of the most recognisable sights in Sri Lanka: a 200-metre granite rock topped with the ruins of a 5th-century royal palace.","de":"Sigiriya ist eines der bekanntesten Wahrzeichen Sri Lankas: ein 200 Meter hoher Granitfelsen, gekrönt von den Ruinen eines königlichen Palastes aus dem 5. Jahrhundert."},{"en":"The climb passes ancient frescoes, mirror walls covered in centuries-old graffiti, and the iconic Lion''s Paw entrance before reaching sweeping views over the surrounding jungle.","de":"Der Aufstieg führt vorbei an antiken Fresken, einer mit jahrhundertealten Graffiti bedeckten Spiegelwand und dem ikonischen Löwentatzen-Eingang, bevor man die weite Aussicht über den umliegenden Dschungel erreicht."}]'::jsonb,
  '[{"en":"5th-century rock fortress and royal palace ruins","de":"Felsenfestung und königliche Palastruinen aus dem 5. Jahrhundert"},{"en":"Ancient frescoes and the famous mirror wall","de":"Antike Fresken und die berühmte Spiegelwand"},{"en":"Panoramic summit views over the cultural triangle","de":"Panoramablick vom Gipfel über das Kulturdreieck"}]'::jsonb,
  'Early morning (7–9am), before the heat and the crowds', 'Früh morgens (7–9 Uhr), vor der Hitze und den Besuchergruppen',
  'sigiriya-lion-rock', 0
),
(
  'trincomalee-beach', 'Trincomalee Beach', 'Trincomalee Strand',
  'East Coast', 'Ostküste',
  'Sri Lanka''s east-coast gem — turquoise water, a natural deep harbour, and some of the island''s best diving.',
  'Sri Lankas Juwel an der Ostküste — türkisfarbenes Wasser, ein natürlicher Tiefwasserhafen und einige der besten Tauchspots der Insel.',
  '/images/stock2/harbor-boats-misty.jpg',
  '[{"en":"Trincomalee sits on one of the finest natural harbours in the world, with calm, clear water that makes it one of Sri Lanka''s best spots for swimming, snorkelling and diving.","de":"Trincomalee liegt an einem der schönsten natürlichen Häfen der Welt, mit ruhigem, klarem Wasser — einer der besten Orte Sri Lankas zum Schwimmen, Schnorcheln und Tauchen."},{"en":"The east coast season (May–September) runs opposite the south-west, so it''s a great choice when Bentota and Galle are in their off-season.","de":"Die Saison an der Ostküste (Mai–September) läuft entgegengesetzt zum Südwesten — eine gute Wahl, wenn in Bentota und Galle Nebensaison herrscht."}]'::jsonb,
  '[{"en":"Calm, clear water for swimming and snorkelling","de":"Ruhiges, klares Wasser zum Schwimmen und Schnorcheln"},{"en":"Pigeon Island National Park nearby","de":"Pigeon Island Nationalpark in der Nähe"},{"en":"Whale watching season March–August","de":"Walbeobachtungssaison März–August"}]'::jsonb,
  'May to September (opposite monsoon to the south coast)', 'Mai bis September (entgegengesetzter Monsun zur Südküste)',
  null, 0
),
(
  'mirissa-beach', 'Mirissa Beach', 'Mirissa Strand',
  'South Coast', 'Südküste',
  'A crescent bay backed by palm trees, and Sri Lanka''s launch point for blue whale watching.',
  'Eine von Palmen gesäumte Bucht in Halbmondform — Sri Lankas Ausgangspunkt für die Beobachtung von Blauwalen.',
  '/images/stock2/palm-point-coast.jpg',
  '[{"en":"Mirissa''s laid-back curve of golden sand is one of the south coast''s most photogenic beaches, framed by coconut palms and calm, swimmable water.","de":"Mirissas entspannte, goldene Sandbucht ist einer der fotogensten Strände der Südküste, gesäumt von Kokospalmen und ruhigem, badefreundlichem Wasser."},{"en":"Boats leave at dawn from Mirissa harbour for a chance to see blue whales and sperm whales, alongside playful pods of dolphins.","de":"Boote legen bei Sonnenaufgang vom Hafen Mirissa ab, um Blauwale, Pottwale und verspielte Delfinschulen zu erleben."}]'::jsonb,
  '[{"en":"Blue whale and dolphin watching boat trips","de":"Bootstouren zur Blauwal- und Delfinbeobachtung"},{"en":"Golden, palm-fringed beach","de":"Goldener, von Palmen gesäumter Strand"},{"en":"Relaxed beachfront cafes and sunset views","de":"Entspannte Strandcafés und Sonnenuntergänge"}]'::jsonb,
  'November to April for whale watching', 'November bis April für Walbeobachtung',
  'mirissa-whale-watching', 0
),
(
  'galle-fort', 'Galle Fort', 'Galle Fort',
  'South Coast', 'Südküste',
  'A 17th-century Dutch fort city — cobbled lanes, ramparts over the ocean, and boutique cafes at every corner.',
  'Eine niederländische Festungsstadt aus dem 17. Jahrhundert — Kopfsteinpflaster, Wälle über dem Meer und Boutique-Cafés an jeder Ecke.',
  '/images/stock2/galle-fort-rampart.jpg',
  '[{"en":"Galle Fort, a UNESCO World Heritage Site, is a walled city built by the Portuguese and expanded by the Dutch in the 17th century.","de":"Galle Fort, ein UNESCO-Welterbe, ist eine von den Portugiesen errichtete und im 17. Jahrhundert von den Niederländern erweiterte Festungsstadt."},{"en":"Wander the ramparts at sunset, browse boutique shops and art galleries in converted colonial villas, and stop for coffee in one of the fort''s many cafes.","de":"Spazieren Sie bei Sonnenuntergang über die Wälle, stöbern Sie in Boutiquen und Kunstgalerien in umgebauten Kolonialvillen und gönnen Sie sich einen Kaffee in einem der vielen Cafés."}]'::jsonb,
  '[{"en":"UNESCO World Heritage Dutch colonial fort","de":"UNESCO-Weltkulturerbe, niederländische Kolonialfestung"},{"en":"Rampart walk with ocean views, best at sunset","de":"Wallspaziergang mit Meerblick, am schönsten bei Sonnenuntergang"},{"en":"Boutique shops, galleries and cafes","de":"Boutiquen, Galerien und Cafés"}]'::jsonb,
  'Late afternoon for the rampart sunset walk', 'Später Nachmittag für den Sonnenuntergangs-Spaziergang auf den Wällen',
  'galle-day-tour', 0
),
(
  'bentota-beach', 'Bentota Beach', 'Bentota Strand',
  'South Coast', 'Südküste',
  'Golden sand, calm water and a river meeting the sea — the south coast''s classic beach-and-watersports base.',
  'Goldener Sand, ruhiges Wasser und ein Fluss, der auf das Meer trifft — die klassische Strand- und Wassersportbasis der Südküste.',
  '/images/beach-villa-coast.jpg',
  '[{"en":"Bentota is where the south coast''s beach resorts are at their most polished — long stretches of golden sand, calm swimmable water, and a wide range of watersports.","de":"In Bentota zeigen sich die Strandresorts der Südküste von ihrer besten Seite — lange goldene Sandstrände, ruhiges, badefreundliches Wasser und ein breites Wassersportangebot."},{"en":"The Bentota River meets the ocean here, making it the starting point for river safaris through mangroves alongside the beach itself.","de":"Hier mündet der Bentota-Fluss ins Meer — der Ausgangspunkt für Flusssafaris durch Mangroven direkt neben dem Strand."}]'::jsonb,
  '[{"en":"Calm, watersports-friendly beach","de":"Ruhiger, wassersportfreundlicher Strand"},{"en":"Bentota River safari through mangroves","de":"Bentota-Flusssafari durch Mangroven"},{"en":"Turtle hatchery and Brief Garden nearby","de":"Schildkröten-Station und Brief Garden in der Nähe"}]'::jsonb,
  'December to March for the calmest sea', 'Dezember bis März für die ruhigste See',
  'bentota-river-safari', 0
)
on conflict (slug) do nothing;
