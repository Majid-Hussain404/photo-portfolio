import { useEffect, useState } from "react";
import type { SiteConfig } from "../../lib/site";
import { compressImageForWeb } from "../../lib/image-compress";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10";

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState<Partial<SiteConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(
    null
  );

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/site-settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings || {});
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage(null);

    try {
      const optimized = await compressImageForWeb(file);
      const formData = new FormData();
      formData.append("file", optimized);

      const res = await fetch("/api/admin/profile-photo", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload photo");

      setSettings((prev) => ({ ...prev, photo: data.photoUrl }));
      setMessage({
        text: "Profile photo updated successfully!",
        error: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading photo.";
      setMessage({ text: msg, error: true });
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save site settings.");
      setMessage({
        text: "Site profile & details saved successfully! Public pages are updated.",
        error: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving settings.";
      setMessage({ text: msg, error: true });
    } finally {
      setSaving(false);
    }
  }

  function handleBioChange(index: number, val: string) {
    const list = [...(settings.bio || [])];
    list[index] = val;
    setSettings({ ...settings, bio: list });
  }

  function addBioParagraph() {
    setSettings({ ...settings, bio: [...(settings.bio || []), ""] });
  }

  function removeBioParagraph(index: number) {
    const list = [...(settings.bio || [])];
    list.splice(index, 1);
    setSettings({ ...settings, bio: list });
  }

  if (loading) {
    return <div className="py-8 text-white/50 text-sm">Loading site settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-serif text-2xl text-white">Portfolio Profile & Branding</h2>
        <p className="mt-1 text-xs text-white/50">
          Update the titles, personal bio, contact info, and social links that visitors see across your portfolio.
        </p>
      </div>

      {/* Profile Photo Upload Section */}
      <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5">
        <label className="block text-xs uppercase tracking-widest text-accent font-semibold mb-3">
          Your Profile Photograph (Displayed on About Me page)
        </label>
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative h-28 w-24 overflow-hidden rounded-2xl border border-white/20 bg-black/40 flex items-center justify-center shrink-0 shadow-lg">
            {settings.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-serif text-3xl text-accent/70 font-light">
                MH
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:scale-105 hover:bg-white cursor-pointer shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span>{uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploadingPhoto}
                onChange={handlePhotoUpload}
              />
            </label>
            <p className="text-xs text-white/50">
              Only you (the owner) can upload or change this photo. Visitors to your site cannot modify it.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Photographer Name
          </label>
          <input
            type="text"
            value={settings.name || ""}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Brand / Studio Title
          </label>
          <input
            type="text"
            value={settings.brand || ""}
            onChange={(e) => setSettings({ ...settings, brand: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Tagline
          </label>
          <input
            type="text"
            value={settings.tagline || ""}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className={field}
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
            Quote / Motto
          </label>
          <input
            type="text"
            value={settings.quote || ""}
            onChange={(e) => setSettings({ ...settings, quote: e.target.value })}
            className={field}
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="font-serif text-lg text-white mb-4">Contact & Location</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Srinagar, India"
              value={settings.location || ""}
              onChange={(e) => setSettings({ ...settings, location: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={settings.phone || ""}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Experience
            </label>
            <input
              type="text"
              placeholder="e.g. 5+ years"
              value={settings.experience || ""}
              onChange={(e) => setSettings({ ...settings, experience: e.target.value })}
              className={field}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h3 className="font-serif text-lg text-white mb-4">Social Media Links</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="text"
              placeholder="https://instagram.com/yourhandle"
              value={settings.instagram || ""}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              Facebook URL
            </label>
            <input
              type="text"
              placeholder="https://facebook.com/yourpage"
              value={settings.facebook || ""}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-1">
              YouTube Channel URL
            </label>
            <input
              type="text"
              placeholder="https://youtube.com/@yourchannel"
              value={settings.youtube || ""}
              onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
              className={field}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-white">About Me / Bio Paragraphs</h3>
          <button
            type="button"
            onClick={addBioParagraph}
            className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-accent hover:border-accent"
          >
            + Add Paragraph
          </button>
        </div>

        <div className="space-y-4">
          {(settings.bio || []).map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-xs text-white/40 pt-3 w-6">{i + 1}.</span>
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleBioChange(i, e.target.value)}
                className={field}
                placeholder={`Paragraph ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeBioParagraph(i)}
                className="pt-3 text-xs text-red-400 hover:text-red-300"
                title="Remove paragraph"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:scale-105 hover:bg-white disabled:opacity-50 cursor-pointer"
        >
          {saving ? "Saving Changes..." : "Save Portfolio Profile"}
        </button>

        {message && (
          <p
            className={`text-xs ${
              message.error ? "text-red-300" : "text-emerald-300"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
