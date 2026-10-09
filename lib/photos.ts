import generated from "./photos.generated.json";

export type Photo = {
  id: string;
  src: string;
  title: string;
  category: string;
  published: boolean;
  date: string;
};

// Static build photos
export const photos: Photo[] = (generated as Photo[]).filter(
  (p) => p.published !== false
);

export const allPhotos: Photo[] = generated as Photo[];

const SUPABASE_METADATA_URL =
  "https://wpkerstuzvbtrqsjklpq.supabase.co/storage/v1/object/public/portfolio/metadata/photos.json";

export async function getDynamicPhotos(): Promise<Photo[]> {
  try {
    const res = await fetch(SUPABASE_METADATA_URL, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {}
  return generated as Photo[];
}