import rawSettings from "./site-settings.json";

export interface SiteConfig {
  name: string;
  brand: string;
  title: string;
  tagline: string;
  quote: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  instagram: string;
  facebook: string;
  youtube: string;
  bio: string[];
  photo?: string;
}

const defaults: SiteConfig = {
  name: "Majid Hussain",
  brand: "Frames by Majid",
  title: "Photographer",
  tagline: "Capturing moments that last forever.",
  quote: "A photograph is a way of holding a feeling still.",
  email: "majidhussainmir239@gmail.com",
  phone: "",
  location: "Srinagar, India",
  experience: "5+ years",
  instagram: "",
  facebook: "",
  youtube: "",
  photo: "",
  bio: [
    "I'm a photographer who loves finding stories in light, landscapes and everyday moments.",
    "My work moves between wide open scenery, quiet nature, people and streets, and the glow of the night sky. Every frame is an attempt to hold a feeling, not just a view.",
    "Alongside photography, I also offer professional photo editing and retouching using Adobe Lightroom and Photoshop, from color correction and cinematic tones to detailed retouching and creative enhancements.",
    "Capturing moments, creating moods, and perfecting every frame — whether behind the camera or behind the screen.",
  ],
};

export const site: SiteConfig = {
  ...defaults,
  ...(rawSettings as Partial<SiteConfig>),
};

const SUPABASE_SETTINGS_URL =
  "https://wpkerstuzvbtrqsjklpq.supabase.co/storage/v1/object/public/portfolio/metadata/site-settings.json";

export async function getDynamicSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(SUPABASE_SETTINGS_URL, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        return {
          ...defaults,
          ...data,
        };
      }
    }
  } catch {}
  return site;
}