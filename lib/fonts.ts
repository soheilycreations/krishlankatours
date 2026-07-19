import localFont from "next/font/local";

export const fraunces = localFont({
  src: [
    { path: "../app/fonts/Fraunces-Variable.ttf", weight: "300 700", style: "normal" },
    { path: "../app/fonts/Fraunces-Italic-Variable.ttf", weight: "300 700", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const workSans = localFont({
  src: [{ path: "../app/fonts/WorkSans-Variable.ttf", weight: "300 700", style: "normal" }],
  variable: "--font-work-sans",
  display: "swap",
});

export const spaceMono = localFont({
  src: [
    { path: "../app/fonts/SpaceMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../app/fonts/SpaceMono-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-mono",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${workSans.variable} ${spaceMono.variable}`;
