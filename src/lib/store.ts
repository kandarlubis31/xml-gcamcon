// ============================================================
// xml-gcamcon — localStorage Store
// Persist configs to browser localStorage
// ============================================================

import type { UserConfig } from "@/types";

const STORAGE_KEY = "gcamcon_configs";
const ACTIVE_CONFIG_KEY = "gcamcon_active";
const THEME_KEY = "gcamcon_theme";

export function saveConfigs(configs: UserConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (e) {
    console.error("Failed to save configs to localStorage:", e);
  }
}

export function loadConfigs(): UserConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load configs from localStorage:", e);
    return [];
  }
}

export function saveActiveConfigId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_CONFIG_KEY, id);
  } catch (e) {
    console.error("Failed to save active config:", e);
  }
}

export function loadActiveConfigId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_CONFIG_KEY);
  } catch (e) {
    return null;
  }
}

export function addConfig(config: UserConfig): UserConfig[] {
  const configs = loadConfigs();
  const existing = configs.findIndex((c) => c.id === config.id);
  if (existing >= 0) {
    configs[existing] = config;
  } else {
    configs.push(config);
  }
  saveConfigs(configs);
  return configs;
}

export function deleteConfig(id: string): UserConfig[] {
  const configs = loadConfigs().filter((c) => c.id !== id);
  saveConfigs(configs);
  return configs;
}

export function updateStoredConfig(updated: UserConfig): UserConfig[] {
  return addConfig(updated);
}

export function getAllSavedConfigs(): UserConfig[] {
  return loadConfigs();
}

// --- Theme ---

export type ThemePreference = "dark" | "light" | "system";

export function saveThemePreference(theme: ThemePreference): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* ignore */ }
}

export function loadThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "system") return stored;
    return "dark";
  } catch {
    return "dark";
  }
}
