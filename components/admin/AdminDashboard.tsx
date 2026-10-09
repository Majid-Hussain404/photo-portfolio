"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PhotoUpload from "./PhotoUpload";
import PhotoManager from "./PhotoManager";
import SiteSettingsEditor from "./SiteSettingsEditor";
import PasswordChanger from "./PasswordChanger";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-white/50 text-xs uppercase tracking-widest">Loading dashboard...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || undefined;

  const [activeTab, setActiveTab] = useState<"photos" | "settings" | "security">("photos");
  const [refreshKey, setRefreshKey] = useState(0);

  function triggerRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-10">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("photos")}
          className={`pb-4 text-xs uppercase tracking-widest font-semibold transition border-b-2 -mb-[2px] cursor-pointer ${
            activeTab === "photos"
              ? "border-accent text-accent"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          Photography Library & Sections
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-4 text-xs uppercase tracking-widest font-semibold transition border-b-2 -mb-[2px] cursor-pointer ${
            activeTab === "settings"
              ? "border-accent text-accent"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          Profile & Portfolio Info
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`pb-4 text-xs uppercase tracking-widest font-semibold transition border-b-2 -mb-[2px] cursor-pointer ${
            activeTab === "security"
              ? "border-accent text-accent"
              : "border-transparent text-white/50 hover:text-white"
          }`}
        >
          Account Security
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "photos" && (
        <div className="space-y-12">
          <PhotoUpload
            defaultCategory={categoryParam}
            onPhotoUploaded={triggerRefresh}
          />
          <PhotoManager refreshKey={refreshKey} onListChanged={triggerRefresh} />
        </div>
      )}

      {activeTab === "settings" && (
        <div>
          <SiteSettingsEditor />
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-8">
          <PasswordChanger />
        </div>
      )}
    </div>
  );
}
