import AdminDashboard from "../../components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl sm:text-5xl text-white">Owner Control Panel</h1>
        <p className="mt-2 text-sm text-white/60 max-w-xl">
          Manage your photography collections, publish or hide photos, update your public profile and bio, and manage account security.
        </p>
      </div>

      <AdminDashboard />
    </div>
  );
}