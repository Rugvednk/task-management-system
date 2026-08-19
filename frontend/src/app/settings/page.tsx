"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Search, User, Sun, Palette, Edit2, Check, Upload, Camera } from "lucide-react";
import ThemeMenu from "../components/ThemeMenu";

const API_URL = "http://localhost:3001";

const avatarPresets = [
  { id: "preset1", label: "Dexter Avatar", color: "from-purple-500 to-pink-500", letter: "D" },
  { id: "preset2", label: "Amber Sun", color: "from-amber-500 to-orange-500", letter: "A" },
  { id: "preset3", label: "Emerald City", color: "from-emerald-500 to-teal-500", letter: "E" },
  { id: "preset4", label: "Ocean Blue", color: "from-blue-500 to-indigo-600", letter: "O" },
  { id: "preset5", label: "Rose Velvet", color: "from-rose-500 to-pink-600", letter: "R" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "theme" | "color">("profile");

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("dexter@gmail.com");
  const [fullName, setFullName] = useState("Dexter");
  const [title, setTitle] = useState("Designer");
  const [username, setUsername] = useState("Dexuser");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [editingEmail, setEditingEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/users`);
        if (res.ok) {
          const users = await res.json();
          if (users.length > 0) {
            const u = users[0];
            setUserId(u.id);
            if (u.email) setEmail(u.email);
            if (u.fullName) setFullName(u.fullName);
            if (u.title) setTitle(u.title);
            if (u.username) setUsername(u.username);
            if (u.profileImage) setProfileImage(u.profileImage);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          title,
          username,
          email,
          profileImage,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex transition-colors">
      {/* Settings Navigation Sidebar */}
      <aside className="w-[240px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 flex flex-col bg-white dark:bg-zinc-900/40">
        {/* Back to App */}
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </Link>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full h-8 pl-8 pr-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-100 outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "profile"
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "theme"
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Theme</span>
          </button>

          <button
            onClick={() => setActiveTab("color")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "color"
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <Palette className="w-4 h-4 text-accent" />
            <span>Color</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-6 md:p-10 max-w-4xl">
        {activeTab === "profile" ? (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Profile
            </h1>

            {/* Profile Info Card */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-6">
              {/* Profile Picture Uploader */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-6 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Profile picture
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Upload a custom image or choose an avatar preset
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Current Image Display */}
                  <div className="relative group">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white shadow-sm">
                        {fullName?.[0] ?? "D"}
                      </div>
                    )}

                    <label className="absolute bottom-0 right-0 p-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full cursor-pointer hover:scale-105 transition shadow-sm">
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset Avatar Selection */}
                  <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setProfileImage(null)}
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${preset.color} flex items-center justify-center text-[10px] font-bold text-white hover:scale-110 transition shadow-xs`}
                        title={preset.label}
                      >
                        {preset.letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email
                </span>
                <div className="flex items-center gap-2">
                  {editingEmail ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-8 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 rounded px-2 text-xs text-zinc-900 dark:text-white outline-none font-medium"
                    />
                  ) : (
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      {email}
                    </span>
                  )}
                  <button
                    onClick={() => setEditingEmail(!editingEmail)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5 gap-2">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full name
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full sm:w-64 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 px-3 text-xs text-zinc-800 dark:text-zinc-200 font-medium outline-none"
                />
              </div>

              {/* Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5 gap-2">
                <div>
                  <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Title
                  </span>
                  <span className="text-[10px] text-zinc-400">Your job title or role</span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full sm:w-64 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 px-3 text-xs text-zinc-800 dark:text-zinc-200 font-medium outline-none"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Username
                  </span>
                  <span className="text-[10px] text-zinc-400">One word, like a nickname or first name</span>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full sm:w-64 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 px-3 text-xs text-zinc-800 dark:text-zinc-200 font-medium outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end items-center gap-3">
                {savedSuccess && (
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Profile saved!
                  </span>
                )}
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="h-9 px-4 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Workspace Access Card */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Workspace access</h2>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-sm flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Remove yourself from the workspace
                </span>

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                  }}
                  className="px-3.5 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/60 transition"
                >
                  Leave Workspace
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {activeTab === "theme" ? "Theme Preferences" : "Color Mode Preferences"}
            </h1>
            <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
              <ThemeMenu />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
