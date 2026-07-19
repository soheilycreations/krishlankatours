export type TourCategory =
  | "wildlife"
  | "heritage"
  | "hillcountry"
  | "wetland"
  | "coastal"
  | "city";

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
  /** Omit when no real photo is available yet — the UI shows a clean
   *  placeholder (icon + gradient) instead of a photo. Never point this
   *  at a stock or third-party image that doesn't actually depict the tour. */
  heroImage?: string;
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
  city: { en: "City", de: "Stadt" },
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
    heroImage: "/images/real/river-safari-mangrove-silhouette.jpg",
    gallery: [
      "/images/real/river-safari-mangrove-silhouette.jpg",
      "/images/real/river-safari-boat-guests.jpg",
      "/images/river-boat-safari.jpg",
    ],
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
      "/images/real/turtle-release-beach.jpg",
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
      { en: "A visit to the Ahungalla turtle conservation project", de: "Ein Besuch beim Meeresschildkröten-Schutzprojekt in Ahungalla" },
      { en: "Three nights at a quiet villa with a private pool", de: "Drei Nächte in einer ruhigen Villa mit privatem Pool" },
      { en: "Zero fixed plans for the coastal half of the trip", de: "Keine festen Pläne für die zweite Hälfte der Reise an der Küste" },
    ],
    itinerary: [
      { day: 1, title: { en: "Arrival and culture evening", de: "Ankunft und kultureller Abend" }, description: { en: "Airport pickup, check in, evening Kandyan dance performance arranged for your group.", de: "Flughafenabholung, Check-in, abends Kandy-Tanzaufführung nur für deine Gruppe." } },
      { day: 2, title: { en: "Drive to the coast", de: "Fahrt zur Küste" }, description: { en: "Relaxed drive south with stops wherever you like, check in to the villa by late afternoon.", de: "Entspannte Fahrt Richtung Süden mit Stopps nach Wunsch, Check-in in der Villa am späten Nachmittag." } },
      { day: 3, title: { en: "Open day", de: "Freier Tag" }, description: { en: "No plan. The pool, the beach, a turtle hatchery visit in Ahungalla, or a village walk if you feel like it.", de: "Kein Programm. Der Pool, der Strand, ein Besuch der Schildkrötenaufzucht in Ahungalla oder ein Dorfspaziergang, ganz nach Lust." } },
      { day: 4, title: { en: "Open day", de: "Freier Tag" }, description: { en: "Same as day three. I check in once to see if you'd like anything arranged.", de: "Wie Tag drei. Ich melde mich einmal, falls du doch etwas unternehmen möchtest." } },
      { day: 5, title: { en: "Departure", de: "Abreise" }, description: { en: "Late check-out and transfer back to the airport.", de: "Später Check-out und Transfer zurück zum Flughafen." } },
    ],
  },
  {
    slug: "galle-day-tour",
    category: "heritage",
    durationDays: 1,
    priceFromUsd: 65,
    groupSize: "1–6 people, one vehicle",
    heroImage: "/images/stock2/galle-fort-rampart.jpg",
    gallery: ["/images/stock2/galle-fort-rampart.jpg", "/images/stock3/galle-clocktower.jpg"],
    title: { en: "Galle Day Tour", de: "Galle Tagestour" },
    tagline: {
      en: "A walled Dutch fort you can still live inside, right on the coast.",
      de: "Eine holländische Festungsstadt, in der noch heute gelebt wird, direkt an der Küste.",
    },
    summary: {
      en: "Galle Fort is a UNESCO World Heritage site — a walled town the Dutch built in the 1600s that's still lived in today, just with boutique shops and cafés tucked into the old trading houses. We walk the ramparts, the lighthouse, and the backstreets at a pace that leaves room for a coffee stop.",
      de: "Galle Fort ist UNESCO-Weltkulturerbe — eine von den Niederländern im 17. Jahrhundert erbaute Festungsstadt, die noch heute bewohnt ist, nur mit Boutiquen und Cafés in den alten Handelshäusern. Wir gehen die Wehrmauern, den Leuchtturm und die Seitengassen in einem Tempo ab, das auch für eine Kaffeepause reicht.",
    },
    highlights: [
      { en: "The full rampart walk at golden hour", de: "Der komplette Wehrmauer-Spaziergang zur goldenen Stunde" },
      { en: "The 1938 Galle lighthouse", de: "Der Leuchtturm von Galle aus dem Jahr 1938" },
      { en: "Dutch Reformed Church and the old gem-trading streets", de: "Die Niederländisch-Reformierte Kirche und die alten Edelsteinhandel-Straßen" },
      { en: "Easy to combine with a Bentota or Ahungalla morning", de: "Lässt sich leicht mit einem Vormittag in Bentota oder Ahungalla kombinieren" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Half day in the fort", de: "Halber Tag in der Festung" },
        description: {
          en: "Late-morning pickup, a couple of hours walking the ramparts and backstreets, lunch at a fort café, return by mid-afternoon.",
          de: "Abholung am späten Vormittag, ein paar Stunden auf den Wehrmauern und in den Seitengassen, Mittagessen in einem Café der Festung, Rückkehr am frühen Nachmittag.",
        },
      },
    ],
  },
  {
    slug: "udawalawe-safari-tour",
    category: "wildlife",
    durationDays: 1,
    priceFromUsd: 90,
    groupSize: "1–6 people, one vehicle",
    gallery: [],
    title: { en: "Udawalawe Safari Tour", de: "Udawalawe-Safari" },
    tagline: {
      en: "The most reliable place on the island to see wild elephants.",
      de: "Der zuverlässigste Ort der Insel, um wilde Elefanten zu sehen.",
    },
    summary: {
      en: "Udawalawe's open grassland makes it the easiest park in Sri Lanka to actually see elephants — herds of thirty or more aren't unusual. Most trips end at the Elephant Transit Home, where orphaned calves are bottle-fed before release back into the park.",
      de: "Die offene Graslandschaft von Udawalawe macht ihn zum Park, in dem man in Sri Lanka am zuverlässigsten Elefanten sieht — Herden von dreißig oder mehr sind keine Seltenheit. Die meisten Touren enden am Elephant Transit Home, wo verwaiste Kälber mit der Flasche gefüttert werden, bevor sie in den Park entlassen werden.",
    },
    highlights: [
      { en: "Large, easy-to-spot elephant herds", de: "Große, leicht zu entdeckende Elefantenherden" },
      { en: "The Elephant Transit Home feeding time", de: "Die Fütterungszeit im Elephant Transit Home" },
      { en: "Water buffalo, crocodiles, and birdlife around the reservoir", de: "Wasserbüffel, Krokodile und Vogelwelt rund um den Stausee" },
      { en: "A calmer, less crowded alternative to Yala", de: "Eine ruhigere, weniger überlaufene Alternative zu Yala" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Park gates to the transit home", de: "Parktor bis zum Transit Home" },
        description: {
          en: "Early pickup, morning game drive by open jeep, late-morning stop at the Elephant Transit Home feeding, return by early afternoon.",
          de: "Frühe Abholung, morgendliche Jeep-Fahrt durch den Park, Halt am späten Vormittag bei der Fütterung im Elephant Transit Home, Rückkehr am frühen Nachmittag.",
        },
      },
    ],
  },
  {
    slug: "sigiriya-lion-rock",
    category: "heritage",
    durationDays: 1,
    priceFromUsd: 75,
    groupSize: "1–6 people, one vehicle",
    heroImage: "/images/stock2/sigiriya-sunset.jpg",
    gallery: ["/images/stock2/sigiriya-sunset.jpg", "/images/stock3/sigiriya-landscape-view.jpg"],
    title: { en: "Sigiriya Lion Rock", de: "Sigiriya-Löwenfelsen" },
    tagline: {
      en: "A 5th-century palace on top of a 200-metre rock, and it's exactly as dramatic as that sounds.",
      de: "Ein Palast aus dem 5. Jahrhundert auf einem 200 Meter hohen Felsen — genauso dramatisch wie es klingt.",
    },
    summary: {
      en: "King Kashyapa built his fortress-palace on top of this rock in the 5th century, and what's left — the giant lion's paw gateway, the frescoed 'cloud maidens', the mirror wall covered in thousand-year-old graffiti, the water gardens at the base — still makes this the single most-photographed site in Sri Lanka. It's a proper climb, so we go early before the heat and the crowds.",
      de: "König Kashyapa erbaute seinen Festungspalast im 5. Jahrhundert auf diesem Felsen, und was übrig ist — das riesige Löwenpfoten-Tor, die freskengeschmückten 'Wolkenmädchen', die mit tausend Jahre alten Graffiti bedeckte Spiegelwand, die Wassergärten am Fuß — macht diesen Ort bis heute zum meistfotografierten Sri Lankas. Es ist ein echter Aufstieg, daher starten wir früh vor Hitze und Menschenmassen.",
    },
    highlights: [
      { en: "Early start to beat the heat and the crowds", de: "Früher Start, um Hitze und Menschenmassen zu umgehen" },
      { en: "The frescoes and the ancient mirror wall", de: "Die Fresken und die antike Spiegelwand" },
      { en: "The water gardens at the base, often skipped by bus tours", de: "Die Wassergärten am Fuß, von Bustouren oft übersprungen" },
      { en: "Easily combined with Dambulla's cave temple nearby", de: "Lässt sich leicht mit dem nahegelegenen Höhlentempel von Dambulla kombinieren" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "The rock, early", de: "Der Felsen, früh am Morgen" },
        description: {
          en: "Very early pickup for a cooler climb, two to three hours at the site including the water gardens, breakfast afterward, return by early afternoon.",
          de: "Sehr frühe Abholung für einen kühleren Aufstieg, zwei bis drei Stunden vor Ort inklusive Wassergärten, danach Frühstück, Rückkehr am frühen Nachmittag.",
        },
      },
    ],
  },
  {
    slug: "kandy-day-tour",
    category: "hillcountry",
    durationDays: 1,
    priceFromUsd: 80,
    groupSize: "1–6 people, one vehicle",
    heroImage: "/images/stock2/kandy-colonial-street.jpg",
    gallery: [
      "/images/stock2/kandy-colonial-street.jpg",
      "/images/stock2/mountain-road-teacountry.jpg",
    ],
    title: { en: "Kandy Day Tour", de: "Kandy Tagestour" },
    tagline: {
      en: "The Tooth Relic, a working tea factory, and the lake in between.",
      de: "Die Zahnreliquie, eine aktive Teefabrik und der See dazwischen.",
    },
    summary: {
      en: "A single day covering Kandy's essentials: the Temple of the Sacred Tooth Relic, a walk around the lake, and a working tea factory on the way up or down, where you'll see the whole process from fresh leaf to the cup. Good for anyone short on time who still wants the highlights without an overnight stay.",
      de: "Ein einzelner Tag deckt das Wesentliche von Kandy ab: den Tempel der Heiligen Zahnreliquie, einen Spaziergang um den See und eine aktive Teefabrik auf dem Hin- oder Rückweg, wo du den gesamten Prozess vom frischen Blatt bis zur Tasse siehst. Gut für alle, die wenig Zeit haben, aber trotzdem die Highlights ohne Übernachtung sehen möchten.",
    },
    highlights: [
      { en: "Temple of the Sacred Tooth Relic", de: "Tempel der Heiligen Zahnreliquie" },
      { en: "A working tea factory, floor to cup", de: "Eine aktive Teefabrik, vom Boden bis zur Tasse" },
      { en: "A walk around Kandy Lake", de: "Ein Spaziergang um den Kandy-See" },
      { en: "Can be arranged as a stop between Colombo and the hill country", de: "Lässt sich als Zwischenstopp zwischen Colombo und dem Hochland einbauen" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Temple, tea, and the lake", de: "Tempel, Tee und der See" },
        description: {
          en: "Morning drive up, temple visit, lakeside lunch, afternoon tea factory tour, return or onward drive by evening.",
          de: "Fahrt hinauf am Morgen, Tempelbesuch, Mittagessen am See, Teefabrik-Führung am Nachmittag, Rückfahrt oder Weiterfahrt am Abend.",
        },
      },
    ],
  },
  {
    slug: "bentota-river-safari",
    category: "wetland",
    durationDays: 1,
    priceFromUsd: 55,
    groupSize: "1–8 people, shared boat",
    gallery: [],
    title: { en: "Bentota River Safari", de: "Bentota-Fluss-Safari" },
    tagline: {
      en: "Mangroves, a cinnamon island, and monitor lizards, all within an hour of the coast.",
      de: "Mangroven, eine Zimtinsel und Warane — alles innerhalb einer Stunde von der Küste.",
    },
    summary: {
      en: "A shorter, easier alternative to the Madu River trip: the Bentota Ganga winds through mangrove forest past a small cinnamon-growing island, with a good chance of monitor lizards and kingfishers along the banks. Easy to fit into a half day.",
      de: "Eine kürzere, einfachere Alternative zur Madu-River-Tour: Der Bentota Ganga schlängelt sich durch Mangrovenwald an einer kleinen Zimtanbau-Insel vorbei, mit guten Chancen auf Warane und Eisvögel an den Ufern. Passt leicht in einen halben Tag.",
    },
    highlights: [
      { en: "A stop at a small cinnamon-growing island", de: "Halt an einer kleinen Zimtanbau-Insel" },
      { en: "Monitor lizards and kingfishers along the banks", de: "Warane und Eisvögel entlang der Ufer" },
      { en: "Shorter than the Madu River trip — good for a half day", de: "Kürzer als die Madu-River-Tour — gut für einen halben Tag" },
      { en: "Easy to combine with a beach morning in Bentota", de: "Lässt sich leicht mit einem Strandvormittag in Bentota kombinieren" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "A couple of hours on the river", de: "Ein paar Stunden auf dem Fluss" },
        description: {
          en: "Morning or afternoon boat departure, roughly two hours through the mangroves and the cinnamon island stop, back on land after.",
          de: "Bootsabfahrt morgens oder nachmittags, etwa zwei Stunden durch die Mangroven mit Halt an der Zimtinsel, danach zurück an Land.",
        },
      },
    ],
  },
  {
    slug: "mirissa-whale-watching",
    category: "coastal",
    durationDays: 1,
    priceFromUsd: 85,
    groupSize: "1–6 people, shared boat",
    heroImage: "/images/stock2/harbor-boats-misty.jpg",
    gallery: ["/images/stock2/harbor-boats-misty.jpg"],
    title: { en: "Mirissa Whale Watching", de: "Mirissa Walbeobachtung" },
    tagline: {
      en: "Blue whales, the largest animal that has ever lived, off Sri Lanka's south coast.",
      de: "Blauwale, das größte Tier, das je gelebt hat, vor Sri Lankas Südküste.",
    },
    summary: {
      en: "The waters off Mirissa are one of the most consistent places on earth to see blue whales, alongside sperm whales and pods of spinner dolphins. Boats leave early, before the wind picks up, and the season runs roughly November to April.",
      de: "Die Gewässer vor Mirissa gehören zu den zuverlässigsten Orten der Welt, um Blauwale zu sehen, zusammen mit Pottwalen und Gruppen von Spinnerdelfinen. Die Boote legen früh ab, bevor der Wind auffrischt, die Saison läuft etwa von November bis April.",
    },
    highlights: [
      { en: "Blue whales and sperm whales, in season", de: "Blauwale und Pottwale, saisonal" },
      { en: "Spinner dolphin pods most mornings", de: "Spinnerdelfin-Gruppen an den meisten Vormittagen" },
      { en: "Early departure for the calmest water", de: "Frühe Abfahrt für das ruhigste Wasser" },
      { en: "Best November to April; other months are hit or miss", de: "Am besten von November bis April; andere Monate sind unsicher" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Early boat, open water", de: "Frühes Boot, offenes Wasser" },
        description: {
          en: "Very early pickup for the harbour departure, three to four hours on the water, back on land by late morning.",
          de: "Sehr frühe Abholung für die Abfahrt im Hafen, drei bis vier Stunden auf dem Wasser, zurück an Land am späten Vormittag.",
        },
      },
    ],
  },
  {
    slug: "colombo-city-tour",
    category: "city",
    durationDays: 1,
    priceFromUsd: 60,
    groupSize: "1–6 people, one vehicle",
    heroImage: "/images/stock2/colombo-lotus-tower.jpg",
    gallery: [
      "/images/stock2/colombo-lotus-tower.jpg",
      "/images/stock2/colombo-galle-face.jpg",
      "/images/stock3/colombo-market-stall.jpg",
    ],
    title: { en: "Colombo City Tour", de: "Colombo Stadttour" },
    tagline: {
      en: "Old and new side by side — colonial streets, temples, and the skyline over it all.",
      de: "Alt und neu nebeneinander — koloniale Straßen, Tempel und die Skyline über allem.",
    },
    summary: {
      en: "Good for an arrival or departure day: Galle Face Green at sunset, the Gangaramaya Temple, the chaos of Pettah market, and the colonial-era Fort district, with the Lotus Tower as the modern skyline marker over it all.",
      de: "Gut für einen An- oder Abreisetag: Galle Face Green bei Sonnenuntergang, der Gangaramaya-Tempel, das Treiben des Pettah-Marktes und das koloniale Fort-Viertel, mit dem Lotus Tower als modernem Skyline-Wahrzeichen über allem.",
    },
    highlights: [
      { en: "Galle Face Green at sunset", de: "Galle Face Green bei Sonnenuntergang" },
      { en: "Gangaramaya Temple and Pettah market", de: "Gangaramaya-Tempel und Pettah-Markt" },
      { en: "The colonial Fort district", de: "Das koloniale Fort-Viertel" },
      { en: "Easy to slot in on an arrival or departure day", de: "Lässt sich leicht an einem An- oder Abreisetag einbauen" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Old town to skyline", de: "Altstadt bis Skyline" },
        description: {
          en: "Half or full day depending on your flight times — temples and markets by midday, Galle Face Green for sunset if timing allows.",
          de: "Halber oder ganzer Tag, je nach Flugzeiten — Tempel und Märkte bis Mittag, Galle Face Green zum Sonnenuntergang, wenn es zeitlich passt.",
        },
      },
    ],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}
