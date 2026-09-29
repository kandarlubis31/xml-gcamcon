// ============================================================
// xml-gcamcon — ThemeToggle Component
// Cycles between dark → light → system theme
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { saveThemePreference, loadThemePreference, type ThemePreference } from "@/lib/store";

type Theme = ThemePreference;

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.className = theme === "system" ? "" : theme;
}

const themeIcons: Record<Theme, string> = {
  dark: "🌙",
  light: "☀️",
  system: "💻",
};

const themeLabels: Record<Theme, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(loadThemePreference());
  }, []);

  useEffect(() => {
    applyTheme(theme);
    saveThemePreference(theme);
  }, [theme]);

  const cycle = () => {
    setTheme((t) => (t === "dark" ? "light" : t === "light" ? "system" : "dark"));
  };

  return (
    <button
      onClick={cycle}
      title={`Theme: ${themeLabels[theme]}`}
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] text-sm transition-all"
    >
      {themeIcons[theme]}
    </button>
  );
}
