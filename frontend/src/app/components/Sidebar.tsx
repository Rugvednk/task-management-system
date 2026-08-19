"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "./UserProvider";
import ThemeMenu from "./ThemeMenu";
import { CheckSquare, FolderKanban, ChevronDown, Settings as SettingsIcon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const fullName = user?.fullName || "Dexter";
  const email = user?.email || "Dexter@gmail.com";
  const title = user?.title || "Product Designer";
  const profileImage = user?.profileImage;

  return (
    <div className="flex flex-col h-full relative">
      {/* Sidebar Top Profile Header Dropdown */}
      <div className="relative border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full h-16 flex items-center px-4 gap-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition text-left"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={fullName}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
              {fullName[0] ?? "D"}
            </div>
          )}

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {fullName}
            </span>
            <span className="text-[10px] text-zinc-400 truncate">{email}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
        </button>

        {/* User Card Popover from Figma */}
        {showUserMenu && (
          <div className="absolute top-14 left-3 right-3 z-30 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 space-y-3">
            <div className="flex flex-col items-center text-center pt-1 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-xs mb-2"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-base font-bold text-white mb-2 shadow-sm">
                  {fullName[0] ?? "D"}
                </div>
              )}
              <span className="text-xs font-bold text-zinc-900 dark:text-white">{fullName}</span>
              <span className="text-[11px] text-zinc-400">{email}</span>
            </div>

            <ThemeMenu />

            <Link
              href="/settings"
              onClick={() => setShowUserMenu(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <SettingsIcon className="w-4 h-4 text-zinc-400" /> Settings
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
          Workspace
        </div>

        <Link
          href="/tasks"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
            pathname === "/tasks"
              ? "bg-zinc-200/60 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <CheckSquare className={`w-4 h-4 ${pathname === "/tasks" ? "text-accent" : ""}`} />
          Tasks
        </Link>

        <Link
          href="/projects"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
            pathname === "/projects"
              ? "bg-zinc-200/60 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <FolderKanban className={`w-4 h-4 ${pathname === "/projects" ? "text-accent" : ""}`} />
          Projects
        </Link>
      </div>

      {/* Footer Settings Link */}
      <div className="mt-auto p-3 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
            pathname === "/settings"
              ? "bg-zinc-200/60 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
          }`}
        >
          <SettingsIcon className="w-4 h-4" /> Settings
        </Link>
      </div>
    </div>
  );
}
