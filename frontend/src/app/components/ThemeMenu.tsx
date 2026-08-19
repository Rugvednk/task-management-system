"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, ChevronRight, Check, Settings, Palette } from "lucide-react";

const colorModes = [
  { id: "amber", label: "Amber", color: "#f59e0b" },
  { id: "blue", label: "Blue", color: "#9333ea" },
  { id: "pink", label: "Pink", color: "#db2777" },
  { id: "rose", label: "Rose", color: "#e11d48" },
  { id: "emerald", label: "Emerald", color: "#059669" },
  { id: "black", label: "Black", color: "#18181b" },
] as const;

export default function ThemeMenu() {
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [openMenu, setOpenMenu] = useState<"theme" | "color" | null>(null);

  return (
    <div className="relative w-full max-w-[320px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden text-left">
      {/* Change Theme */}
      <button
        onClick={() => setOpenMenu(openMenu === "theme" ? null : "theme")}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition"
      >
        <span className="flex items-center gap-3 font-medium">
          {theme === "dark" ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          Change Theme
        </span>
        <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${openMenu === "theme" ? "rotate-90" : ""}`} />
      </button>

      {/* Theme options */}
      {openMenu === "theme" && (
        <div className="border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 py-1">
          <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
            Theme Selection
          </div>
          <button
            onClick={() => {
              setTheme("light");
              setOpenMenu(null);
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <span className="flex items-center gap-2.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Light
            </span>
            {theme === "light" && <Check className="w-3.5 h-3.5 text-accent" />}
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setOpenMenu(null);
            }}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <span className="flex items-center gap-2.5">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              Dark
            </span>
            {theme === "dark" && <Check className="w-3.5 h-3.5 text-accent" />}
          </button>
        </div>
      )}

      <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800/80" />

      {/* Color Mode */}
      <button
        onClick={() => setOpenMenu(openMenu === "color" ? null : "color")}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition"
      >
        <span className="flex items-center gap-3 font-medium">
          <Palette className="w-4 h-4 text-accent" />
          Color Mode
        </span>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10"
            style={{
              backgroundColor: colorModes.find((item) => item.id === colorMode)?.color,
            }}
          />
          <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${openMenu === "color" ? "rotate-90" : ""}`} />
        </div>
      </button>

      {/* Color options */}
      {openMenu === "color" && (
        <div className="border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 py-1">
          <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
            Accent Color
          </div>
          {colorModes.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setColorMode(item.id);
                setOpenMenu(null);
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              {colorMode === item.id && <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />}
            </button>
          ))}
        </div>
      )}

      <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800/80" />

      {/* Settings */}
      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition">
        <Settings className="w-4 h-4 text-zinc-400" />
        Settings
      </button>
    </div>
  );
}