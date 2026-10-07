export type Category = {
  slug: string;
  name: string;
  description: string;
  from: string;
  to: string;
};

export const categories: Category[] = [
  { slug: "landscape", name: "Landscape", description: "Wide horizons, mountains and open skies.", from: "#10b981", to: "#115e59" },
  { slug: "sunset", name: "Sunset", description: "Golden hours and fading light.", from: "#f97316", to: "#9f1239" },
  { slug: "nature", name: "Nature", description: "Forests, flowers and quiet details.", from: "#84cc16", to: "#166534" },
  { slug: "wildlife", name: "Wildlife", description: "Animals and birds in their world.", from: "#d97706", to: "#78350f" },
  { slug: "portrait", name: "Portrait", description: "People, faces and expressions.", from: "#ec4899", to: "#6b21a8" },
  { slug: "street", name: "Street", description: "Everyday life in the city.", from: "#64748b", to: "#1e293b" },
  { slug: "architecture", name: "Architecture", description: "Buildings, lines and structures.", from: "#38bdf8", to: "#1e3a8a" },
  { slug: "travel", name: "Travel", description: "Places and journeys.", from: "#fbbf24", to: "#b45309" },
  { slug: "night", name: "Night", description: "Stars, city lights and long exposures.", from: "#6366f1", to: "#0f172a" },
];