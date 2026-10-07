import PasswordPreview from "../../components/admin/PasswordPreview";
import PhotoListPreview from "../../components/admin/PhotoListPreview";
import UploadPreview from "../../components/admin/UploadPreview";

const stats = [
  { label: "Total photographs", value: "24" },
  { label: "Published", value: "21" },
  { label: "Hidden", value: "3" },
  { label: "Categories", value: "9" },
];

export default function AdminPage() {
  return (
    <div className="space-y-14">
      <section>
        <h1 className="font-serif text-4xl">Photographs</h1>
        <p className="mt-2 max-w-xl text-white/60">
          Upload, hide or delete photographs. When connected, changes will
          appear on your public website straight away.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="font-serif text-4xl text-accent">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-white/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <UploadPreview />
      <PhotoListPreview />

      <section className="border-t border-white/10 pt-12">
        <h2 className="mb-6 font-serif text-3xl">Account security</h2>
        <PasswordPreview />
      </section>
    </div>
  );
}