import generated from "./photos.generated.json";

export type Photo = {
  src: string;
  title: string;
  category: string;
};

// This list is built automatically from the folders in public/photos/.
// Run "npm run photos" after adding or removing pictures.
export const photos: Photo[] = generated as Photo[];