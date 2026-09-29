// ============================================================
// xml-gcamcon — Config Sharing via URL hash
// Encode/decode UserConfig to/from URL-safe base64 hash
// ============================================================

import type { UserConfig } from "@/types";

/**
 * Encode a UserConfig into a URL-safe base64 string.
 */
function encodeConfig(config: UserConfig): string {
  const json = JSON.stringify(config);
  // btoa + encodeURIComponent for safe URL encoding
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 hash string back into a UserConfig.
 */
function decodeConfig(hash: string): UserConfig | null {
  try {
    // Restore base64 padding and chars
    let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    // Basic validation: must have required UserConfig fields
    if (parsed && parsed.id && parsed.portId && parsed.deviceCodename) {
      return parsed as UserConfig;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Build a full shareable URL for a config.
 */
export function buildShareUrl(config: UserConfig): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#config=${encodeConfig(config)}`;
}

/**
 * Extract and decode a config from the current URL hash.
 * Returns null if no config hash is present or decoding fails.
 */
export function getConfigFromHash(): UserConfig | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#config=(.+)/);
  return match ? decodeConfig(match[1]) : null;
}

/**
 * Remove the config hash from URL after loading.
 */
export function clearConfigHash(): void {
  if (typeof window === "undefined") return;
  if (window.location.hash.startsWith("#config=")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}
