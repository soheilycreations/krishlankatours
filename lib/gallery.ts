import type { LocalizedText } from "./tours";

export interface GalleryImage {
  src: string;
  caption: LocalizedText;
  tall?: boolean;
}

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/golden-temple-hills.jpg",
    caption: { en: "A mountain temple above the clouds", de: "Ein Bergtempel über den Wolken" },
    tall: true,
  },
  {
    src: "/images/elephants-trio.jpg",
    caption: { en: "Young elephants at play", de: "Junge Elefanten beim Spielen" },
  },
  {
    src: "/images/monk-meditation-cliff.jpg",
    caption: { en: "A quiet morning above the sea", de: "Ein ruhiger Morgen über dem Meer" },
    tall: true,
  },
  {
    src: "/images/kandyan-dance.jpg",
    caption: { en: "Traditional Kandyan dance", de: "Traditioneller Kandy-Tanz" },
  },
  {
    src: "/images/polonnaruwa-ruins.jpg",
    caption: { en: "The old royal palace at Polonnaruwa", de: "Der alte Königspalast von Polonnaruwa" },
  },
  {
    src: "/images/real/river-safari-mangrove-silhouette.jpg",
    caption: { en: "Canoeing the wetland channels", de: "Kanufahrt durch die Feuchtgebietskanäle" },
    tall: true,
  },
  {
    src: "/images/real/turtle-release-beach.jpg",
    caption: { en: "A turtle release at Ahungalla", de: "Eine Schildkröten-Freilassung in Ahungalla" },
  },
  {
    src: "/images/ancient-statue-polonnaruwa.jpg",
    caption: { en: "A standing stone figure, Polonnaruwa", de: "Eine stehende Steinfigur, Polonnaruwa" },
  },
  {
    src: "/images/buddha-carving.jpg",
    caption: { en: "Rock-carved Buddha statue", de: "In Fels gehauene Buddha-Statue" },
  },
  {
    src: "/images/villa-pool-sunset.jpg",
    caption: { en: "Evening light at a coastal villa", de: "Abendlicht an einer Küstenvilla" },
  },
  {
    src: "/images/couple-pool-sunset.jpg",
    caption: { en: "Sunset by the water", de: "Sonnenuntergang am Wasser" },
    tall: true,
  },
  {
    src: "/images/palm-avenue-garden.jpg",
    caption: { en: "The royal palm avenue", de: "Die königliche Palmenallee" },
  },
  {
    src: "/images/elephant-single.jpg",
    caption: { en: "An elephant in the undergrowth", de: "Ein Elefant im Unterholz" },
  },
  {
    src: "/images/macaque-monkey.jpg",
    caption: { en: "A macaque keeping watch", de: "Ein Makake auf der Hut" },
  },
  {
    src: "/images/real/river-safari-boat-guests.jpg",
    caption: { en: "Out on the river", de: "Unterwegs auf dem Fluss" },
  },
  {
    src: "/images/bee-eater-bird.jpg",
    caption: { en: "A bee-eater catching the light", de: "Ein Bienenfresser im Licht" },
  },
  {
    src: "/images/stock2/palm-point-coast.jpg",
    caption: { en: "A quiet point on the south coast", de: "Ein ruhiger Punkt an der Südküste" },
    tall: true,
  },
  {
    src: "/images/stock2/rattan-craft-shop.jpg",
    caption: { en: "A roadside cane and rattan workshop", de: "Eine Rattan-Werkstatt am Straßenrand" },
  },
  {
    src: "/images/stock2/small-island-lagoon.jpg",
    caption: { en: "A small island, a lagoon", de: "Eine kleine Insel, eine Lagune" },
  },
  {
    src: "/images/stock2/rocky-coast-cloudy.jpg",
    caption: { en: "Rock pools on a quiet morning", de: "Felsenpools an einem ruhigen Morgen" },
    tall: true,
  },
  {
    src: "/images/stock2/beach-villa-coast.jpg",
    caption: { en: "A stretch of the south coast", de: "Ein Abschnitt der Südküste" },
  },
  {
    src: "/images/stock3/rice-paddy-aerial.jpg",
    caption: { en: "Rice paddies, seen from above", de: "Reisfelder aus der Vogelperspektive" },
    tall: true,
  },
  {
    src: "/images/stock3/tuktuk-forest-road.jpg",
    caption: { en: "The everyday way to get around", de: "Das alltägliche Fortbewegungsmittel" },
  },
  {
    src: "/images/stock3/aerial-coastal-boats.jpg",
    caption: { en: "Fishing boats off the south coast", de: "Fischerboote vor der Südküste" },
  },
  {
    src: "/images/stock3/beach-hut-remote.jpg",
    caption: { en: "A quiet, unmarked stretch of sand", de: "Ein ruhiger, unbenannter Sandstreifen" },
    tall: true,
  },
  {
    src: "/images/stock3/stormy-coastal-sunset.jpg",
    caption: { en: "Storm light over the coast", de: "Gewitterlicht über der Küste" },
  },
];
