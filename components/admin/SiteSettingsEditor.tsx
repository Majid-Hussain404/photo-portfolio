"use client";

import { useEffect, useState } from "react";
import type { SiteConfig } from "../../lib/site";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-accent focus:bg-white/10";

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState<Partial<SiteConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
