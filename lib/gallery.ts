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
    src: "/images/river-boat-safari.jpg",
    caption: { en: "Canoeing the wetland channels", de: "Kanufahrt durch die Feuchtgebietskanäle" },
    tall: true,
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
    src: "/images/bee-eater-bird.jpg",
    caption: { en: "A bee-eater catching the light", de: "Ein Bienenfresser im Licht" },
  },
];
