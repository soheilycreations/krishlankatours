export interface BlogPost {
  slug: string;
  title: { en: string; de: string };
  excerpt: { en: string; de: string };
  image: string;
  date: string; // ISO
  readMinutes: number;
  body: { en: string[]; de: string[] }; // paragraphs
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-time-visit-sri-lanka",
    title: {
      en: "Best Time to Visit Sri Lanka (Region by Region)",
      de: "Beste Reisezeit für Sri Lanka (Region für Region)",
    },
    excerpt: {
      en: "Sri Lanka has two monsoons, not one — which means there's a good beach somewhere almost year-round. Here's how to plan around them.",
      de: "Sri Lanka hat zwei Monsune, nicht einen — das heißt, fast das ganze Jahr über gibt es irgendwo einen schönen Strand. So planen Sie Ihre Reise.",
    },
    image: "/images/stock2/palm-point-coast.jpg",
    date: "2026-05-10",
    readMinutes: 5,
    body: {
      en: [
        "Sri Lanka's weather is shaped by two separate monsoons that hit opposite coasts at different times of year, which trips up a lot of first-time visitors planning around a single 'dry season'.",
        "The southwest coast — Bentota, Galle, Mirissa, Ahungalla — has its best weather from December to March, when skies are clear and the sea is calm. This is peak season, and also the best window for whale watching out of Mirissa.",
        "The east coast — Trincomalee, Arugam Bay — flips the other way, with the best conditions from May to September. If you're chasing surf, Arugam Bay's season runs through these months.",
        "The hill country and cultural triangle (Kandy, Ella, Sigiriya, Anuradhapura) are pleasant almost all year, though the hills get noticeably cooler and mistier from November to January.",
        "Our honest advice: for a first two-week trip combining the south coast, hill country, and cultural sites, December to March gives you the most reliable weather everywhere at once.",
      ],
      de: [
        "Das Wetter in Sri Lanka wird von zwei getrennten Monsunen bestimmt, die zu unterschiedlichen Jahreszeiten auf gegenüberliegende Küsten treffen — das verwirrt viele Erstbesucher, die mit einer einzigen 'Trockenzeit' planen.",
        "Die Südwestküste — Bentota, Galle, Mirissa, Ahungalla — hat von Dezember bis März das beste Wetter, mit klarem Himmel und ruhiger See. Dies ist Hochsaison und auch das beste Zeitfenster für Walbeobachtung ab Mirissa.",
        "Die Ostküste — Trincomalee, Arugam Bay — verhält sich umgekehrt, mit den besten Bedingungen von Mai bis September. Wer Surfen sucht: Die Saison in Arugam Bay läuft in diesen Monaten.",
        "Das Hochland und das Kulturdreieck (Kandy, Ella, Sigiriya, Anuradhapura) sind fast das ganze Jahr über angenehm, wobei es in den Bergen von November bis Januar merklich kühler und nebliger wird.",
        "Unser ehrlicher Rat: Für eine erste zweiwöchige Reise mit Südküste, Hochland und Kulturstätten bietet Dezember bis März überall die zuverlässigsten Wetterbedingungen.",
      ],
    },
  },
  {
    slug: "sigiriya-vs-pidurangala",
    title: {
      en: "Sigiriya vs. Pidurangala: Which Rock Should You Climb?",
      de: "Sigiriya vs. Pidurangala: Welchen Felsen sollten Sie besteigen?",
    },
    excerpt: {
      en: "Everyone knows Sigiriya. Fewer know that the best photo of it is taken from the rock right next door. Here's how to decide — or do both.",
      de: "Jeder kennt Sigiriya. Weniger bekannt: Das beste Foto davon macht man vom Felsen direkt daneben. So entscheiden Sie sich — oder besuchen beide.",
    },
    image: "/images/stock3/sigiriya-landscape-view.jpg",
    date: "2026-04-22",
    readMinutes: 4,
    body: {
      en: [
        "Sigiriya, the ancient rock fortress, is one of Sri Lanka's eight UNESCO World Heritage Sites and rightly the country's most famous single attraction — royal ruins, frescoes, and the iconic Lion's Paw entrance at the summit.",
        "Pidurangala is the smaller, rougher rock directly opposite. The climb is steeper and less manicured, but it delivers the single best view in the cultural triangle: Sigiriya itself, rising out of the jungle, especially at sunrise.",
        "If you only have time for one and want the history and the frescoes, choose Sigiriya. If you've already climbed Sigiriya on a previous trip, or you want that famous sunrise photograph, Pidurangala is the better call.",
        "Our tip: with an early start, both are very doable in one morning — Pidurangala for sunrise, then Sigiriya once the site opens, before the midday heat and the tour bus crowds arrive.",
      ],
      de: [
        "Sigiriya, die antike Felsenfestung, ist eine von Sri Lankas acht UNESCO-Welterbestätten und zu Recht die berühmteste Einzelattraktion des Landes — königliche Ruinen, Fresken und der ikonische Löwentatzen-Eingang am Gipfel.",
        "Pidurangala ist der kleinere, unwegsamere Felsen direkt gegenüber. Der Aufstieg ist steiler und weniger ausgebaut, bietet aber die beste Aussicht im Kulturdreieck: Sigiriya selbst, wie es aus dem Dschungel aufragt, besonders bei Sonnenaufgang.",
        "Wenn Sie nur Zeit für einen haben und Geschichte und Fresken wollen, wählen Sie Sigiriya. Wenn Sie Sigiriya bereits bei einer früheren Reise bestiegen haben oder das berühmte Sonnenaufgangsfoto wollen, ist Pidurangala die bessere Wahl.",
        "Unser Tipp: Mit einem frühen Start sind beide an einem Vormittag gut machbar — Pidurangala zum Sonnenaufgang, dann Sigiriya, sobald es öffnet, bevor die Mittagshitze und die Reisebusse kommen.",
      ],
    },
  },
  {
    slug: "packing-list-sri-lanka",
    title: {
      en: "What to Pack for Sri Lanka — A Practical Checklist",
      de: "Was Sie für Sri Lanka einpacken sollten — eine praktische Checkliste",
    },
    excerpt: {
      en: "Tropical heat, temple dress codes, hill-country evenings and monsoon showers — here's what actually earns a spot in your suitcase.",
      de: "Tropische Hitze, Tempel-Kleidervorschriften, kühle Abende im Hochland und Monsunschauer — das gehört wirklich in Ihren Koffer.",
    },
    image: "/images/stock2/hillcountry-misty-dusk.jpg",
    date: "2026-03-15",
    readMinutes: 6,
    body: {
      en: [
        "Sri Lanka's climate changes more across a single day's drive than most countries manage all year, so the trick is packing light layers rather than heavy items.",
        "Temple and religious site etiquette: shoulders and knees must be covered, and shoes come off before entering. A light scarf or sarong is the single most useful item for this — cheap to buy locally too.",
        "For the coast: breathable cotton or linen, reef-safe sunscreen (a legal requirement at some marine parks), and a dry bag for boat trips and river safaris.",
        "For the hill country: a light jacket or fleece for Nuwara Eliya and Ella evenings, which can dip surprisingly cool, especially December to February.",
        "Practical extras: a reusable water bottle, mosquito repellent, and a portable charger for long driving days between sights. Everything else — sarongs, umbrellas, flip-flops — is easy and cheap to buy once you're here.",
      ],
      de: [
        "Sri Lankas Klima ändert sich innerhalb einer einzigen Tagesfahrt mehr als in manchen Ländern über das ganze Jahr — daher lohnen sich leichte Schichten statt schwerer Kleidungsstücke.",
        "Etikette in Tempeln und religiösen Stätten: Schultern und Knie müssen bedeckt sein, Schuhe werden vor dem Betreten ausgezogen. Ein leichter Schal oder Sarong ist dafür das nützlichste Kleidungsstück — auch günstig vor Ort erhältlich.",
        "Für die Küste: atmungsaktive Baumwolle oder Leinen, riffverträglicher Sonnenschutz (in manchen Meeresparks Pflicht) und ein wasserdichter Beutel für Bootstouren und Flusssafaris.",
        "Für das Hochland: eine leichte Jacke oder ein Fleece für die Abende in Nuwara Eliya und Ella, die besonders von Dezember bis Februar überraschend kühl werden können.",
        "Praktische Extras: eine wiederbefüllbare Wasserflasche, Mückenschutz und eine Powerbank für lange Fahrtage zwischen den Sehenswürdigkeiten. Alles andere — Sarongs, Regenschirme, Flip-Flops — ist vor Ort leicht und günstig erhältlich.",
      ],
    },
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
