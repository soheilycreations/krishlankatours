import type { LocalizedText } from "./tours";

export interface Destination {
  slug: string;
  name: LocalizedText;
  region: LocalizedText;
  tagline: LocalizedText;
  image: string;
  description: LocalizedText[];
  highlights: LocalizedText[];
  bestTime: LocalizedText;
  relatedTourSlug: string;
}

export const destinations: Destination[] = [
  {
    slug: "yala",
    name: { en: "Yala National Park", de: "Yala-Nationalpark" },
    region: { en: "Southern Province", de: "Südprovinz" },
    tagline: {
      en: "One of the highest leopard densities anywhere in the world.",
      de: "Eine der höchsten Leoparden-Dichten weltweit.",
    },
    image: "/images/elephants-trio.jpg",
    description: [
      {
        en: "Yala is Sri Lanka's most visited national park, and the reason most people come: elephants in loose family herds, crocodiles along the tank edges, and — if you're patient and a little lucky — a leopard crossing the track at first light.",
        de: "Yala ist Sri Lankas meistbesuchter Nationalpark, und der Grund, warum die meisten Leute kommen: Elefanten in lockeren Familienherden, Krokodile an den Uferrändern der Stauseen, und — mit etwas Geduld und Glück — ein Leopard, der bei Tagesanbruch den Weg kreuzt.",
      },
      {
        en: "The park is split into blocks; Block 1 is the busiest but also the most reliable for sightings. Early morning and late afternoon drives are noticeably quieter and cooler than midday.",
        de: "Der Park ist in Blöcke unterteilt; Block 1 ist am belebtesten, aber auch am zuverlässigsten für Sichtungen. Fahrten am frühen Morgen und späten Nachmittag sind spürbar ruhiger und kühler als am Mittag.",
      },
    ],
    highlights: [
      { en: "Highest leopard density in Asia", de: "Höchste Leopardendichte Asiens" },
      { en: "Large elephant herds year-round", de: "Große Elefantenherden das ganze Jahr über" },
      { en: "Coastal lagoons with crocodiles and waterbirds", de: "Küstenlagunen mit Krokodilen und Wasservögeln" },
    ],
    bestTime: {
      en: "February–June is driest and best for sightings. The park closes for maintenance most Septembers.",
      de: "Februar–Juni ist am trockensten und am besten für Sichtungen. Der Park schließt meist im September zur Wartung.",
    },
    relatedTourSlug: "wild-heart-safari",
  },
  {
    slug: "kandy",
    name: { en: "Kandy", de: "Kandy" },
    region: { en: "Central Province", de: "Zentralprovinz" },
    tagline: {
      en: "The last hill capital, and home to Sri Lanka's most sacred relic.",
      de: "Die letzte Hügelhauptstadt und Heimat von Sri Lankas heiligster Reliquie.",
    },
    image: "/images/kandyan-dance.jpg",
    description: [
      {
        en: "Kandy was the final stronghold of Sri Lanka's kings before colonial rule, and it still feels like a capital — a lake at its centre, hills on every side, and the Temple of the Sacred Tooth Relic drawing pilgrims every evening for the drumming that opens its doors.",
        de: "Kandy war die letzte Hochburg der srilankischen Könige vor der Kolonialzeit und wirkt bis heute wie eine Hauptstadt — ein See im Zentrum, Hügel auf allen Seiten, und der Tempel der Heiligen Zahnreliquie, der jeden Abend Pilger zur Trommelzeremonie anzieht.",
      },
      {
        en: "It's also the best place on the island to see a full Kandyan dance performance — drummers, fire, and the acrobatic Ves dance in full costume — and it sits right on the scenic train line up to the hill country.",
        de: "Es ist außerdem der beste Ort auf der Insel, um eine vollständige Kandy-Tanzaufführung zu erleben — Trommler, Feuer und der akrobatische Ves-Tanz in voller Tracht — und liegt direkt an der malerischen Zugstrecke ins Hochland.",
      },
    ],
    highlights: [
      { en: "Temple of the Sacred Tooth Relic", de: "Tempel der Heiligen Zahnreliquie" },
      { en: "Evening Kandyan dance performances", de: "Abendliche Kandy-Tanzaufführungen" },
      { en: "Royal Botanical Gardens, Peradeniya, nearby", de: "Königlicher Botanischer Garten Peradeniya in der Nähe" },
    ],
    bestTime: {
      en: "Pleasant most of the year; the Esala Perahera festival (July/August) is spectacular but very crowded.",
      de: "Angenehm fast das ganze Jahr; das Esala-Perahera-Fest (Juli/August) ist spektakulär, aber sehr voll.",
    },
    relatedTourSlug: "culture-and-coast-escape",
  },
  {
    slug: "nuwara-eliya",
    name: { en: "Nuwara Eliya", de: "Nuwara Eliya" },
    region: { en: "Central Highlands", de: "Zentrales Hochland" },
    tagline: {
      en: "Cool mountain air, tea estates, and a strange colonial hangover.",
      de: "Kühle Bergluft, Teeplantagen und ein eigenartiges koloniales Erbe.",
    },
    image: "/images/golden-temple-hills.jpg",
    description: [
      {
        en: "At close to 2,000 metres, Nuwara Eliya is noticeably cold in the evenings — locals call it 'Little England' for the old bungalows, the golf course, and the tea rolling out over every hillside as far as you can see.",
        de: "Auf fast 2.000 Metern Höhe wird es abends in Nuwara Eliya deutlich kühl — Einheimische nennen es 'Klein England' wegen der alten Bungalows, des Golfplatzes und des Teeanbaus, der sich über jeden Hügel erstreckt, soweit das Auge reicht.",
      },
      {
        en: "Most visitors combine a working tea factory tour (you'll walk the same floors the pluckers do) with a slow drive through the estates themselves, where the roads run right along the edge of the tea rows.",
        de: "Die meisten Besucher kombinieren eine Führung durch eine aktive Teefabrik (du gehst über dieselben Böden wie die Pflückerinnen) mit einer gemütlichen Fahrt durch die Plantagen selbst, wo die Straßen direkt am Rand der Teereihen entlangführen.",
      },
    ],
    highlights: [
      { en: "Working tea factories open for tours", de: "Aktive Teefabriken mit Führungen" },
      { en: "Cool climate — a genuine break from the lowland heat", de: "Kühles Klima — eine echte Abwechslung zur Hitze im Tiefland" },
      { en: "Gregory Lake and colonial-era architecture", de: "Gregory Lake und Architektur aus der Kolonialzeit" },
    ],
    bestTime: {
      en: "Year-round, though April is busiest (and priciest) for the Sri Lankan New Year holidays.",
      de: "Ganzjährig, wobei April wegen der srilankischen Neujahrsferien am belebtesten (und teuersten) ist.",
    },
    relatedTourSlug: "hill-country-sacred-peaks",
  },
  {
    slug: "ella",
    name: { en: "Ella", de: "Ella" },
    region: { en: "Uva Province", de: "Uva-Provinz" },
    tagline: {
      en: "Small hill town, big views — and the train ride everyone talks about.",
      de: "Kleine Bergstadt, große Aussichten — und die Zugfahrt, von der alle sprechen.",
    },
    image: "/images/monk-meditation-cliff.jpg",
    description: [
      {
        en: "Ella is compact enough to walk everywhere, which is most of its appeal: Little Adam's Peak is an easy sunrise walk, Ella Rock a longer one, and the Nine Arch Bridge sits right in the middle of tea country with a train crossing it a few times a day.",
        de: "Ella ist so kompakt, dass man alles zu Fuß erreicht, und genau das macht einen Großteil des Reizes aus: Little Adam's Peak ist ein leichter Sonnenaufgangsspaziergang, Ella Rock ein längerer, und die Nine-Arch-Bridge liegt mitten im Teeland, über die mehrmals täglich ein Zug fährt.",
      },
      {
        en: "The train journey up from Kandy — or onward to Badulla — is often called one of the most scenic in the world, and Ella is the natural place to break the trip and stay a night or two.",
        de: "Die Zugfahrt von Kandy hinauf — oder weiter nach Badulla — gilt oft als eine der landschaftlich schönsten der Welt, und Ella ist der natürliche Ort, um die Reise zu unterbrechen und ein bis zwei Nächte zu bleiben.",
      },
    ],
    highlights: [
      { en: "Nine Arch Bridge", de: "Nine-Arch-Bridge" },
      { en: "Little Adam's Peak and Ella Rock viewpoints", de: "Aussichtspunkte Little Adam's Peak und Ella Rock" },
      { en: "On the scenic Kandy–Badulla train line", de: "An der malerischen Zugstrecke Kandy–Badulla" },
    ],
    bestTime: {
      en: "January–March for the clearest views; it's misty (and green) much of the rest of the year.",
      de: "Januar–März für die klarste Sicht; den Rest des Jahres ist es oft neblig (und sehr grün).",
    },
    relatedTourSlug: "hill-country-sacred-peaks",
  },
  {
    slug: "anuradhapura",
    name: { en: "Anuradhapura", de: "Anuradhapura" },
    region: { en: "North Central Province", de: "Nordzentralprovinz" },
    tagline: {
      en: "Sri Lanka's first capital, and one of the oldest continuously restored cities on earth.",
      de: "Sri Lankas erste Hauptstadt und eine der ältesten fortlaufend restaurierten Städte der Erde.",
    },
    image: "/images/ancient-statue-polonnaruwa.jpg",
    description: [
      {
        en: "Founded around the 4th century BC, Anuradhapura was the island's capital for over a thousand years. The scale is what surprises most visitors — dagobas (stupas) like Ruwanwelisaya and Jetavanaramaya were among the tallest structures in the ancient world, built entirely of brick.",
        de: "Anuradhapura wurde um das 4. Jahrhundert v. Chr. gegründet und war über tausend Jahre lang die Hauptstadt der Insel. Das Ausmaß überrascht die meisten Besucher — Dagobas (Stupas) wie Ruwanwelisaya und Jetavanaramaya gehörten zu den höchsten Bauwerken der antiken Welt, vollständig aus Ziegeln errichtet.",
      },
      {
        en: "The sacred Bodhi tree here, Jaya Sri Maha Bodhi, is grown from a cutting of the original tree in India under which the Buddha is said to have attained enlightenment, and is documented as the oldest human-planted tree in the world with a known planting date.",
        de: "Der heilige Bodhi-Baum hier, Jaya Sri Maha Bodhi, wuchs aus einem Ableger des Baumes in Indien, unter dem Buddha der Überlieferung nach die Erleuchtung erlangte, und gilt als der älteste von Menschen gepflanzte Baum der Welt mit bekanntem Pflanzdatum.",
      },
    ],
    highlights: [
      { en: "Jaya Sri Maha Bodhi, the sacred fig tree", de: "Jaya Sri Maha Bodhi, der heilige Bodhi-Baum" },
      { en: "Ruwanwelisaya and Jetavanaramaya dagobas", de: "Die Dagobas Ruwanwelisaya und Jetavanaramaya" },
      { en: "Best explored slowly, by bicycle", de: "Am besten in Ruhe mit dem Fahrrad erkundet" },
    ],
    bestTime: {
      en: "May–September is driest; early morning is far more comfortable than midday on the open dagoba platforms.",
      de: "Mai–September ist am trockensten; früher Morgen ist auf den offenen Dagoba-Plattformen deutlich angenehmer als der Mittag.",
    },
    relatedTourSlug: "ancient-kingdoms-trail",
  },
  {
    slug: "polonnaruwa",
    name: { en: "Polonnaruwa", de: "Polonnaruwa" },
    region: { en: "North Central Province", de: "Nordzentralprovinz" },
    tagline: {
      en: "Sri Lanka's medieval capital, compact enough to see properly in a day.",
      de: "Sri Lankas mittelalterliche Hauptstadt, kompakt genug, um sie an einem Tag richtig zu sehen.",
    },
    image: "/images/polonnaruwa-ruins.jpg",
    description: [
      {
        en: "Polonnaruwa succeeded Anuradhapura as the capital in the 11th century, and its ruins are closer together and better preserved — the royal palace, the audience hall, and the quadrangle of temples can all be covered on foot or by bicycle in a single morning.",
        de: "Polonnaruwa löste Anuradhapura im 11. Jahrhundert als Hauptstadt ab, und seine Ruinen liegen enger beieinander und sind besser erhalten — der Königspalast, die Audienzhalle und das Tempel-Quadrangle lassen sich an einem einzigen Vormittag zu Fuß oder mit dem Fahrrad besichtigen.",
      },
      {
        en: "The highlight for most visitors is Gal Vihara: four Buddha statues carved directly into a single granite outcrop, finished with a precision that still isn't fully explained.",
        de: "Der Höhepunkt für die meisten Besucher ist Gal Vihara: vier Buddha-Statuen, direkt aus einem einzigen Granitfelsen gemeißelt, mit einer Präzision vollendet, die bis heute nicht vollständig erklärt ist.",
      },
    ],
    highlights: [
      { en: "Gal Vihara's rock-cut Buddha statues", de: "Die aus Fels gehauenen Buddha-Statuen von Gal Vihara" },
      { en: "The royal palace and council chamber ruins", de: "Die Ruinen des Königspalasts und der Ratskammer" },
      { en: "Compact enough to cycle in half a day", de: "Kompakt genug für eine halbtägige Fahrradtour" },
    ],
    bestTime: {
      en: "May–September, same dry window as Anuradhapura — the two are usually visited together.",
      de: "Mai–September, dasselbe Trockenfenster wie Anuradhapura — beide werden meist zusammen besucht.",
    },
    relatedTourSlug: "ancient-kingdoms-trail",
  },
];

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}
