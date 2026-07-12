export type TourCategory =
  | "wildlife"
  | "heritage"
  | "hillcountry"
  | "wetland"
  | "coastal";

export interface LocalizedText {
  en: string;
  de: string;
}

export interface ItineraryDay {
  day: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Tour {
  slug: string;
  category: TourCategory;
  durationDays: number;
  priceFromUsd: number;
  groupSize: string;
  heroImage: string;
  gallery: string[];
  title: LocalizedText;
  tagline: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  itinerary: ItineraryDay[];
}

export const categoryLabels: Record<TourCategory, LocalizedText> = {
  wildlife: { en: "Wildlife", de: "Tierwelt" },
  heritage: { en: "Heritage", de: "Kulturerbe" },
  hillcountry: { en: "Hill Country", de: "Hochland" },
  wetland: { en: "Wetland", de: "Feuchtgebiet" },
  coastal: { en: "Coast & Rest", de: "Küste & Erholung" },
};

export const tours: Tour[] = [
  {
    slug: "wild-heart-safari",
    category: "wildlife",
    durationDays: 1,
    priceFromUsd: 95,
    groupSize: "1–6 people, one vehicle",
    heroImage: "/images/elephants-trio.jpg",
    gallery: [
      "/images/elephants-trio.jpg",
      "/images/elephant-single.jpg",
      "/images/macaque-monkey.jpg",
      "/images/bee-eater-bird.jpg",
    ],
    title: { en: "Wild Heart Safari", de: "Wild-Heart-Safari" },
    tagline: {
      en: "A full day tracking elephants, macaques and jewel-coloured birds.",
      de: "Ein ganzer Tag auf der Spur von Elefanten, Makaken und farbenprächtigen Vögeln.",
    },
    summary: {
      en: "I pick you up before sunrise and we drive into the national park while the light is still soft, when the herds are out feeding and the park roads are quiet. This is the trip people ask me to repeat.",
      de: "Ich hole dich vor Sonnenaufgang ab, und wir fahren in den Nationalpark, solange das Licht noch weich ist und die Herden grasen. Diese Tour wird mich am häufigsten gebucht.",
    },
    highlights: [
      { en: "Open-jeep safari with a tracker who knows the herds by name", de: "Jeep-Safari mit einem Guide, der die Elefantenherden persönlich kennt" },
      { en: "Best light for photos: 6am departure", de: "Bestes Licht für Fotos: Abfahrt um 6 Uhr" },
      { en: "Packed Sri Lankan breakfast eaten trackside", de: "Sri-lankisches Frühstück direkt am Wegesrand" },
      { en: "Small groups only, never shared with strangers", de: "Nur kleine Gruppen, nie mit Fremden geteilt" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Park gates to golden hour", de: "Parktor bis zur goldenen Stunde" },
        description: {
          en: "Early pickup from your hotel, safari jeep entry at first light, two game drives with a lunch break at a lakeside rest stop, return by early evening.",
          de: "Frühe Abholung im Hotel, Safari-Jeep bei Tagesanbruch, zwei Fahrten mit Mittagspause am See, Rückkehr am frühen Abend.",
        },
      },
    ],
  },
  {
    slug: "ancient-kingdoms-trail",
    category: "heritage",
    durationDays: 3,
    priceFromUsd: 260,
    groupSize: "1–8 people, air-conditioned vehicle",
    heroImage: "/images/polonnaruwa-ruins.jpg",
    gallery: [
      "/images/polonnaruwa-ruins.jpg",
      "/images/ancient-statue-polonnaruwa.jpg",
      "/images/buddha-carving.jpg",
    ],
    title: { en: "Ancient Kingdoms Trail", de: "Pfad der alten Königreiche" },
    tagline: {
      en: "Three days through the stone capitals of Polonnaruwa and Anuradhapura.",
      de: "Drei Tage durch die steinernen Königsstädte von Polonnaruwa und Anuradhapura.",
    },
    summary: {
      en: "This route follows the old royal roads between two capital cities that are over a thousand years old. I walk you through the carvings myself and explain the parts most guidebooks skip.",
      de: "Diese Route folgt den alten Königswegen zwischen zwei über tausend Jahre alten Hauptstädten. Ich zeige dir die Steinmetzarbeiten persönlich und erkläre die Details, die die meisten Reiseführer auslassen.",
    },
    highlights: [
      { en: "Private walking tour of the Polonnaruwa quadrangle", de: "Private Führung durch das Polonnaruwa-Quadrangle" },
      { en: "The rock-carved Buddha statues at Gal Vihara at sunrise", de: "Die in Fels gehauenen Buddha-Statuen von Gal Vihara bei Sonnenaufgang" },
      { en: "A stop at a family spice garden along the way", de: "Zwischenstopp in einem familiengeführten Gewürzgarten" },
      { en: "Air-conditioned vehicle for the long stretches", de: "Klimatisiertes Fahrzeug für die langen Strecken" },
    ],
    itinerary: [
      { day: 1, title: { en: "Colombo to Polonnaruwa", de: "Colombo nach Polonnaruwa" }, description: { en: "Morning departure, lunch stop at a roadside curd-and-honey shop, check in and an easy evening walk around the tank bund.", de: "Abfahrt am Morgen, Mittagspause bei einem Curd-and-Honey-Stand, Check-in und ein entspannter Abendspaziergang am Stausee." } },
      { day: 2, title: { en: "The stone city", de: "Die Steinstadt" }, description: { en: "Full day on foot and by bicycle through the ruins, the royal palace, and Gal Vihara.", de: "Ganztägig zu Fuß und mit dem Fahrrad durch die Ruinen, den Königspalast und Gal Vihara." } },
      { day: 3, title: { en: "Anuradhapura and return", de: "Anuradhapura und Rückkehr" }, description: { en: "Morning in the older capital, sacred Bodhi tree, then the drive back with a spice garden stop.", de: "Morgen in der älteren Hauptstadt, der heilige Bodhi-Baum, dann die Rückfahrt mit Stopp im Gewürzgarten." } },
    ],
  },
  {
    slug: "hill-country-sacred-peaks",
    category: "hillcountry",
    durationDays: 4,
    priceFromUsd: 340,
    groupSize: "1–6 people, private driver",
    heroImage: "/images/golden-temple-hills.jpg",
    gallery: [
      "/images/golden-temple-hills.jpg",
      "/images/monk-meditation-cliff.jpg",
      "/images/palm-avenue-garden.jpg",
    ],
    title: { en: "Hill Country & Sacred Peaks", de: "Hochland & Heilige Gipfel" },
    tagline: {
      en: "Tea country, misty temples and a hermitage on the rocks above the sea.",
      de: "Teeland, nebelverhangene Tempel und eine Einsiedelei auf den Felsen über dem Meer.",
    },
    summary: {
      en: "We climb slowly out of the lowlands into tea country, where the temples sit above the clouds. This is the trip for people who want quiet mornings more than a checklist.",
      de: "Wir steigen langsam aus dem Tiefland ins Teeland auf, wo die Tempel über den Wolken liegen. Diese Tour ist für alle, die ruhige Morgen mehr schätzen als eine Checkliste.",
    },
    highlights: [
      { en: "A mountain temple usually missed by tour buses", de: "Ein Bergtempel, den Reisebusse meist übersehen" },
      { en: "Walk beneath the royal palm avenue at a botanical garden", de: "Spaziergang unter der königlichen Palmenallee im botanischen Garten" },
      { en: "Tea factory visit with the family who runs it", de: "Besuch einer Teefabrik bei der Familie, die sie führt" },
      { en: "Slow pace: two nights in the hills, no long transfers", de: "Ruhiges Tempo: zwei Nächte im Hochland, keine langen Transfers" },
    ],
    itinerary: [
      { day: 1, title: { en: "Into the hills", de: "Hinauf ins Hochland" }, description: { en: "Drive up through the tea estates, stopping at waterfalls along the way, evening arrival at a hill-country stay.", de: "Fahrt hinauf durch die Teeplantagen mit Stopps an Wasserfällen, abends Ankunft im Hochland." } },
      { day: 2, title: { en: "Tea, temple and cloud forest", de: "Tee, Tempel und Nebelwald" }, description: { en: "Morning tea factory tour, afternoon at the mountain temple, walk through the botanical garden's palm avenue.", de: "Morgens Teefabrik, nachmittags Bergtempel, Spaziergang durch die Palmenallee des botanischen Gartens." } },
      { day: 3, title: { en: "The hermitage above the sea", de: "Die Einsiedelei über dem Meer" }, description: { en: "Drive to the coastal hermitage rock for a quiet morning, then descend toward the coast.", de: "Fahrt zum Felsen der Küsteneinsiedelei für einen ruhigen Morgen, danach Abstieg zur Küste." } },
      { day: 4, title: { en: "Return", de: "Rückfahrt" }, description: { en: "Easy morning, return drive with a final stop at a viewpoint.", de: "Ruhiger Morgen, Rückfahrt mit einem letzten Halt an einem Aussichtspunkt." } },
    ],
  },
  {
    slug: "lagoon-wetland-safari",
    category: "wetland",
    durationDays: 1,
    priceFromUsd: 70,
    groupSize: "1–8 people, shared canoe",
    heroImage: "/images/river-boat-safari.jpg",
    gallery: ["/images/river-boat-safari.jpg"],
    title: { en: "Lagoon & Wetland Safari", de: "Lagunen- & Feuchtgebiets-Safari" },
    tagline: {
      en: "A half-day paddling through mangrove channels most visitors never see.",
      de: "Ein halber Tag durch Mangrovenkanäle, die die meisten Besucher nie zu sehen bekommen.",
    },
    summary: {
      en: "We swap the van for a canoe and follow the narrow channels through the wetland, past monitor lizards and kingfishers, ending at a quiet stretch of open lagoon.",
      de: "Wir tauschen den Van gegen ein Kanu und folgen den schmalen Kanälen durch das Feuchtgebiet, vorbei an Warane und Eisvögeln, bis zu einem ruhigen Abschnitt der offenen Lagune.",
    },
    highlights: [
      { en: "Local canoe paddlers who grew up on these channels", de: "Einheimische Kanu-Paddler, die an diesen Kanälen aufgewachsen sind" },
      { en: "Mangrove tunnels too narrow for motorboats", de: "Mangroventunnel, zu eng für Motorboote" },
      { en: "Best for birdwatchers and slow mornings", de: "Ideal für Vogelbeobachter und ruhige Vormittage" },
      { en: "Combine easily with an airport transfer day", de: "Lässt sich leicht mit einem Flughafentransfer kombinieren" },
    ],
    itinerary: [
      { day: 1, title: { en: "Half-day on the water", de: "Halber Tag auf dem Wasser" }, description: { en: "Morning pickup, canoe briefing, three hours paddling the channels and open lagoon, return by early afternoon.", de: "Abholung am Morgen, Kanu-Einweisung, drei Stunden auf den Kanälen und der offenen Lagune, Rückkehr am frühen Nachmittag." } },
    ],
  },
  {
    slug: "culture-and-coast-escape",
    category: "coastal",
    durationDays: 5,
    priceFromUsd: 480,
    groupSize: "1–4 people, private driver",
    heroImage: "/images/couple-pool-sunset.jpg",
    gallery: [
      "/images/kandyan-dance.jpg",
      "/images/villa-pool-sunset.jpg",
      "/images/couple-pool-sunset.jpg",
    ],
    title: { en: "Culture & Coast Escape", de: "Kultur- & Küstenflucht" },
    tagline: {
      en: "A slower five days: one cultural evening, then the coast to do nothing at all.",
      de: "Fünf ruhigere Tage: ein kultureller Abend, dann die Küste, um gar nichts zu tun.",
    },
    summary: {
      en: "Built for couples and small families who want one real cultural evening and several days after that with no itinerary at all, just a villa pool and the coast.",
      de: "Für Paare und kleine Familien gedacht, die einen echten kulturellen Abend und danach mehrere Tage ganz ohne Programm wollen, nur ein Pool und die Küste.",
    },
    highlights: [
      { en: "A traditional Kandyan dance evening arranged privately", de: "Ein traditioneller Kandy-Tanzabend, privat arrangiert" },
      { en: "Three nights at a quiet villa with a private pool", de: "Drei Nächte in einer ruhigen Villa mit privatem Pool" },
      { en: "Zero fixed plans for the coastal half of the trip", de: "Keine festen Pläne für die zweite Hälfte der Reise an der Küste" },
      { en: "Airport transfers included both ways", de: "Flughafentransfers in beide Richtungen inbegriffen" },
    ],
    itinerary: [
      { day: 1, title: { en: "Arrival and culture evening", de: "Ankunft und kultureller Abend" }, description: { en: "Airport pickup, check in, evening Kandyan dance performance arranged for your group.", de: "Flughafenabholung, Check-in, abends Kandy-Tanzaufführung nur für deine Gruppe." } },
      { day: 2, title: { en: "Drive to the coast", de: "Fahrt zur Küste" }, description: { en: "Relaxed drive south with stops wherever you like, check in to the villa by late afternoon.", de: "Entspannte Fahrt Richtung Süden mit Stopps nach Wunsch, Check-in in der Villa am späten Nachmittag." } },
      { day: 3, title: { en: "Open day", de: "Freier Tag" }, description: { en: "No plan. The pool, the beach, or a village walk if you feel like it.", de: "Kein Programm. Der Pool, der Strand oder ein Dorfspaziergang, ganz nach Lust." } },
      { day: 4, title: { en: "Open day", de: "Freier Tag" }, description: { en: "Same as day three. I check in once to see if you'd like anything arranged.", de: "Wie Tag drei. Ich melde mich einmal, falls du doch etwas unternehmen möchtest." } },
      { day: 5, title: { en: "Departure", de: "Abreise" }, description: { en: "Late check-out and transfer back to the airport.", de: "Später Check-out und Transfer zurück zum Flughafen." } },
    ],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
