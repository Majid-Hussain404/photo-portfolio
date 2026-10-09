import generated from "./photos.generated.json";

export type Photo = {
  id: string;
  src: string;
  title: string;
  category: string;
  published: boolean;
  date: string;
};

// Public photos: Only photographs that are marked published = true
export const photos: Photo[] = (generated as Photo[]).filter(
  (p) => p.published !== false
);

// All photos: Available for the owner management panel
export const allPhotos: Photo[] = generated as Photo[];