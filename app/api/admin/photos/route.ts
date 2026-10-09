import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedOwner } from "../../../../lib/auth";
import { getPhotosList, savePhotosList } from "../../../../lib/supabase-photos";
import type { Photo } from "../../../../lib/photos";

export async function GET() {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await getPhotosList();
  return NextResponse.json({ photos: list });
}

export async function POST(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { src, title, category } = body;

    if (!src || !category) {
      return NextResponse.json(
        { error: "Image URL (src) and category are required." },
        { status: 400 }
      );
    }

    const list = await getPhotosList();
    const newPhoto: Photo = {
      id: `ph_${Math.random().toString(36).substring(2, 9)}`,
      src,
      title: title?.trim() || "Photograph",
      category,
      published: true,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    list.unshift(newPhoto);
    await savePhotosList(list);

    return NextResponse.json({
      success: true,
      photo: newPhoto,
      message: `Added to ${category} collection.`,
    });
  } catch (err: unknown) {
    console.error("Failed to add photo record:", err);
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, published, category } = body;

    if (!id) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    const list = await getPhotosList();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (typeof title === "string" && title.trim()) {
      list[index].title = title.trim();
    }
    if (typeof published === "boolean") {
      list[index].published = published;
    }
    if (typeof category === "string" && category.trim()) {
      list[index].category = category.trim();
    }

    await savePhotosList(list);
    return NextResponse.json({ success: true, photo: list[index] });
  } catch (err) {
    console.error("Failed to update photo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const owner = await getAuthenticatedOwner();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    const list = await getPhotosList();
    const photo = list.find((p) => p.id === id);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const updated = list.filter((p) => p.id !== id);
    await savePhotosList(updated);

    return NextResponse.json({ success: true, removedId: id });
  } catch (err) {
    console.error("Failed to delete photo:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
