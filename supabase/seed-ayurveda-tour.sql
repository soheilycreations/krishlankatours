-- Adds the "Sri Lanka Ayurveda Massage Experience" tour.
-- Run once in Supabase SQL Editor → New query.

insert into tours (
  slug, category, duration_days, price_from_usd, group_size,
  hero_image, gallery, title_en, title_de, tagline_en, tagline_de,
  summary_en, summary_de, highlights, itinerary, sort_order
) values
(
  'ayurveda-massage-experience', 'coastal', 1, null, 'Individuals or couples, per session',
  null,
  ARRAY[]::text[],
  'Sri Lanka Ayurveda Massage Experience', 'Sri Lanka Ayurveda-Massage-Erlebnis',
  'Relax, rejuvenate, and reconnect with Sri Lanka''s ancient wellness tradition.',
  'Entspannen, regenerieren und die uralte Wellness-Tradition Sri Lankas neu erleben.',
  'Sri Lanka isn''t only about beaches, wildlife, and ancient temples — it''s also home to Ayurveda, one of the island''s most treasured wellness traditions. A traditional Ayurvedic oil massage uses warm herbal oils and gentle techniques to relax the body and mind after a day of sightseeing. We can help arrange a suitable Ayurveda or wellness centre around Ahungalla, Bentota, Beruwala, and Balapitiya, and combine it with your private tours and excursions.',
  'Sri Lanka besteht nicht nur aus Stränden, Tierwelt und alten Tempeln — die Insel ist auch die Heimat von Ayurveda, einer ihrer wertvollsten Wellness-Traditionen. Bei einer traditionellen ayurvedischen Ölmassage werden warme Kräuteröle und sanfte Techniken eingesetzt, um Körper und Geist nach einem Tag voller Sightseeing zu entspannen. Wir helfen gerne, ein passendes Ayurveda- oder Wellnesscenter rund um Ahungalla, Bentota, Beruwala und Balapitiya zu finden, und kombinieren dies mit Ihren privaten Touren und Ausflügen.',
  '[
    {"en":"Traditional Ayurvedic oil massage","de":"Traditionelle ayurvedische Ölmassage"},
    {"en":"Herbal steam bath and herbal baths","de":"Kräuterdampfbad und Kräuterbäder"},
    {"en":"Head, scalp, and foot massage","de":"Kopf-, Kopfhaut- und Fußmassage"},
    {"en":"Shirodhara, yoga, and meditation","de":"Shirodhara, Yoga und Meditation"},
    {"en":"Near Ahungalla, Bentota, Beruwala & Balapitiya","de":"In der Nähe von Ahungalla, Bentota, Beruwala und Balapitiya"},
    {"en":"Can be combined with your private tour itinerary","de":"Lässt sich mit Ihrer privaten Tour kombinieren"}
  ]'::jsonb,
  '[{"day":1,"title":{"en":"Your Ayurveda Wellness Session","de":"Ihre Ayurveda-Wellness-Sitzung"},"description":{"en":"A calm, traditional spa setting with a warm herbal oil massage, optional steam bath and herbal treatments, plus yoga or meditation if you''d like — a peaceful way to unwind after sightseeing along the southern coast.","de":"Eine ruhige, traditionelle Spa-Umgebung mit warmer Kräuterölmassage, optionalem Dampfbad und Kräuterbehandlungen sowie Yoga oder Meditation nach Wunsch — ein friedlicher Weg, um nach Sightseeing an der Südküste zu entspannen."}}]'::jsonb,
  100
)
on conflict (slug) do nothing;
