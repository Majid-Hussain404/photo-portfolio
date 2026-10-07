export type Layout =
  | "panorama"
  | "glow"
  | "organic"
  | "safari"
  | "portrait"
  | "film"
  | "blueprint"
  | "polaroid"
  | "neon";

export type Theme = {
  layout: Layout;
  tagline: string;
  titleClass: string;
  accent: string;
  wrap: string;
};

export const themes: Record<string, Theme> = {
  landscape: {
    layout: "panorama",
    tagline: "Wide horizons",
    titleClass: "font-serif tracking-wide",
    accent: "#7dd3a8",
    wrap: "max-w-6xl",
  },
  sunset: {
    layout: "glow",
    tagline: "Golden hour",
    titleClass: "font-serif italic",
    accent: "#ffb067",
    wrap: "max-w-7xl",
  },
  nature: {
    layout: "organic",
    tagline: "Wild and quiet",
    titleClass: "font-serif",
    accent: "#86efac",
    wrap: "max-w-7xl",
  },
  wildlife: {
    layout: "safari",
    tagline: "Field journal",
    titleClass: "font-serif uppercase tracking-widest",
    accent: "#e9c98a",
    wrap: "max-w-7xl",
  },
  portrait: {
    layout: "portrait",
    tagline: "Faces and stories",
    titleClass: "font-serif font-light uppercase tracking-[0.3em]",
    accent: "#e5e5e5",
    wrap: "max-w-6xl",
  },
  street: {
    layout: "film",
    tagline: "Frames from the city",
    titleClass: "font-mono uppercase tracking-widest",
    accent: "#fcd34d",
    wrap: "max-w-7xl",
  },
  architecture: {
    layout: "blueprint",
    tagline: "Lines and structure",
    titleClass: "font-mono uppercase tracking-[0.4em]",
    accent: "#93c5fd",
    wrap: "max-w-7xl",
  },
  travel: {
    layout: "polaroid",
    tagline: "Postcards from the road",
    titleClass: "font-serif italic",
    accent: "#fcd9a0",
    wrap: "max-w-6xl",
  },
  night: {
    layout: "neon",
    tagline: "After dark",
    titleClass:
      "font-light uppercase tracking-[0.4em] [text-shadow:0_0_20px_#22d3ee]",
    accent: "#67e8f9",
    wrap: "max-w-7xl",
  },
};